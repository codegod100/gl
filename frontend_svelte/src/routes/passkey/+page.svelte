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
    const reg = await startRegistration(data.options);
    const p = await fetch("/verify_registration", {
      method: "POST",
      body: JSON.stringify({ options: data.options, reg }),
    });
  }
  async function authenticate() {
    const res = await fetch(`/auth_options/${username}`);
    const { authOptions, passkey } = await res.json();
    console.log({ authOptions });
    try {
      console.log("before call");
      const auth = await startAuthentication(authOptions);
      console.log("after call");
      console.log({ auth });
      const res = await fetch("/verify_auth", {
        method: "POST",
        body: JSON.stringify({
          authOptions: authOptions,
          auth,
          passkey: passkey,
        }),
      });
      verified = (await res.json()) as boolean;
      console.log({ verified });
      if (verified) {
      }
    } catch (e) {
      console.log("we got an error", e);
    }
  }

  onMount(async () => {
    console.log({ data });
    // const passkey = await getPasskey();
    // if (passkey instanceof Error) {
    //   return Response.error();
    // }
    if (!data.passKeyError) {
      console.log("authenticating");
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
<!-- <button class="btn variant-filled" on:click={authenticate}>Authenticate</button> -->
<div>
  <button class="btn variant-filled" on:click={authenticate}
    >Authenticate</button
  >
</div>
<button class="btn variant-filled" on:click={register}>Register</button>
<div>Verified: {verified}</div>
