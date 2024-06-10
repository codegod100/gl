<script lang="ts">
  import { init, Wasmer } from "@wasmer/sdk";
  import { onMount } from "svelte";
  let output = "";
  let started = false;
  let pkg: Wasmer;
  onMount(async () => {
    console.log("loading");
    if (!started) {
      console.log("initial");
      await init();
      pkg = await Wasmer.fromRegistry("cowsay");
      started = true;
    }
    console.log("loaded");

    console.log("got package");
    const instance = await pkg.entrypoint.run({
      args: "Test",
    });

    const { code, stdout } = await instance.wait();
    console.log({ code, stdout });
    output = stdout;
    output = output.replaceAll("\n", "<br>");
    output = output.replaceAll(" ", "&nbsp;");
  });
  export let data;
</script>

<div class="text-2xl">CATT</div>

<div>Hello {data.user?.name}, I see you; {data.user?.birthday}</div>
<div>{@html output}</div>
<div><a class="anchor" href="/">Go home</a></div>
