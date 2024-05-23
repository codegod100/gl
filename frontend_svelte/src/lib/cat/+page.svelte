<script lang="ts">
    import { onMount } from "svelte";

    onMount(async () => {
        const app = await import("$lib/gl.js");

        let start = app.start("#app");
    });
</script>

<div class="mb-1"><a href="/foo">Go foo</a></div>
<div id="app"></div>
