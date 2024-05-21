<script>
    // import { start } from "$lib/gl.js";
    import { onMount } from "svelte";
    onMount(async () => {
        const app = await import("$lib/gl.js");
        app.start("#app");
    });
    // start("#app");
</script>

<a href="/foo">CLick</a>
<div id="app"></div>
