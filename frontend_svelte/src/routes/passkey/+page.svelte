<script lang="ts">
  import ls from "localstorage-slim";
  import { onMount } from "svelte";
  // import { getPasskeyByUserID } from "$lib/db";
  import {
    startRegistration,
    startAuthentication,
  } from "@simplewebauthn/browser";
  import type { Passkey } from "$lib/passkey";
  export let data;
  let verified = false;
  let username = "";
  async function register() {
    const res = await fetch(`/reg_options/${username}`);
    const { options, passkey, message } = await res.json();
    if (res.status !== 200) {
      alert(message);
    }
    try {
      const reg = await startRegistration(options);
      await fetch("/verify_registration", {
        method: "POST",
        body: JSON.stringify({ options, reg }),
      });
    } catch (e) {
      console.log(e);
      if (e.name === "InvalidStateError") {
        return alert("Already registered");
      }
    }
  }
  async function authenticate() {
    let res = await fetch(`/auth_options/${username}?challenge=fooo`);
    const { authOptions, passkey, message } = await res.json();
    if (res.status !== 200) {
      alert(message);
    }
    try {
      const auth = await startAuthentication(authOptions);
      console.log("SIGNATURE", auth.response.signature);
      res = await fetch("/verify_auth", {
        method: "POST",
        body: JSON.stringify({
          authOptions: authOptions,
          auth,
          passkey: passkey,
        }),
      });
    } catch (e) {
      if (e.name === "NotAllowedError") {
        return;
        // return alert("User cancelled");
      }
      // alert(e);
    }

    verified = (await res.json()) as boolean;
    if (verified) {
    }
  }

  onMount(async () => {
    // const passkey = await getPasskey();
    // if (passkey instanceof Error) {
    //   return Response.error();
    // }
    if (!data.passKeyError) {
      // await authenticate();
    }

    // const getPasskey = async () => {
    // console.log("getting passkey");
    // const key = await getPasskeyByUserID(Number.parseInt(data.user.id));
    // console.log({ key });
    // if (key instanceof Error) {
    //   return null;
    // }
    // return key;
  });
</script>

<input
  type="text"
  name="username"
  class="input"
  autocomplete="webauthn"
  bind:value={username}
/>
<div>
  <button class="btn variant-filled" on:click={authenticate}
    >Authenticate</button
  >
</div>
<button class="btn variant-filled" on:click={register}>Register</button>
<div>Verified: {verified}</div>
