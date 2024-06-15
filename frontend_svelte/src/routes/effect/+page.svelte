<script lang="ts">
  import { Effect } from "effect";
  import { onMount } from "svelte";

  const fail = Effect.fail("nope");
  const program = Effect.match(fail, {
    onFailure: (e) => e,
    onSuccess: (v) => v,
  });
  onMount(async () => {
    const prom = await Effect.runPromise(program);
    console.log({ prom });
  });
</script>

Yolo
