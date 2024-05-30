<script>
  import { onMount } from "svelte";
  import {
    startRegistration,
    startAuthentication,
  } from "@simplewebauthn/browser";
  export let data;
  async function register() {
    await startRegistration(data.options);
  }
  console.log("data", data);
  async function authenticate() {
    try {
      const auth = await startAuthentication(data.authOptions, true);
      console.log({ auth });
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
