<script lang="ts">
  import { onMount } from "svelte";
  import { base64 } from "@sveu/browser";
  let privkey: ArrayBuffer;
  let pubkey: ArrayBuffer;
  let gen: Uint8Array;
  async function generate() {
    gen = window.crypto.getRandomValues(new Uint8Array(16));
  }
  //   $: privateKey = base64(privkey);
  //   $: publicKey = base64(pubkey);
  function importKey() {
    return window.crypto.subtle.importKey(
      "raw",
      gen,
      {
        name: "ECDSA",
        namedCurve: "P-384",
      },
      false,
      ["sign", "verify"],
    );
  }
  //   async function newPair() {
  //     return await window.crypto.subtle.generateKey(
  //       {
  //         name: "ECDSA",
  //         namedCurve: "P-384",
  //       },
  //       true,
  //       ["sign", "verify"],
  //     );
  //   }
  //   async function exportKey(key: CryptoKey) {
  //     return await window.crypto.subtle.exportKey("jwk", key);
  //   }
  async function sign(privateKey: CryptoKey, message: string) {
    return await window.crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      privateKey,
      new TextEncoder().encode(message),
    );
  }
  async function verify(
    publicKey: CryptoKey,
    signature: ArrayBuffer,
    message: string,
  ) {
    return await window.crypto.subtle.verify(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      publicKey,
      signature,
      new TextEncoder().encode(message),
    );
  }
  onMount(async () => {
    const kp = await importKey();
    const sig = await sign(kp, "hello");
    const verified = await verify(kp.publicKey, sig, "hello");
    console.log({ verified });
    const username = "test";
    console.log(kp.privateKey);
    const privateKey = await exportKey(kp.privateKey);
    const publicKey = await exportKey(kp.publicKey);
    console.log("exported");
    let res = await fetch("/store_key", {
      method: "POST",
      body: JSON.stringify({
        username,
        privateKey,
        publicKey,
      }),
    });
    const data = await res.json();
    const key = await importKey(data.key);
    console.log({ data, key });
  });
</script>

<div><button on:click={generate}>Generate</button></div>
