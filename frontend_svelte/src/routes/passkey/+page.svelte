<script lang="ts">
  import ls from "localstorage-slim";
  import { onMount } from "svelte";
  import {
    startRegistration,
    startAuthentication,
  } from "@simplewebauthn/browser";
  import type { Passkey } from "$lib/passkey";
  export let data;
  let passkey: Passkey;

  async function register() {
    const reg = await startRegistration(data.options);
    const p = await fetch("/verify_registration", {
      method: "POST",
      body: JSON.stringify({ options: data.options, reg }),
    });
  }
  console.log("data", data);
  async function authenticate() {
    try {
      const auth = await startAuthentication(data.authOptions, true);
      console.log({ auth });
      await fetch("/verify_auth", {
        method: "POST",
        body: JSON.stringify({
          authOptions: data.authOptions,
          auth,
          passkey,
          username: data.user.username,
        }),
      });
    } catch (e) {
      console.log("we got an error", e);
    }
  }
  onMount(async () => {
    await authenticate();
  });
</script>

<input type="text" name="username" class="input" autocomplete="webauthn" />
<!-- <button class="btn variant-filled" on:click={authenticate}>Authenticate</button> -->
<button class="btn variant-filled" on:click={register}>Register</button>
