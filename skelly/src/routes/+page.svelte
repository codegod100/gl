<script lang="ts">
    import { onMount } from "svelte";

    onMount(async () => {
        const app = await import("$lib/gl.js");
        const foo = (m) => {
            console.log(m);
            console.log(m.cat);
            console.log(new app.Cat(...app.convert_cat(m.cat)));
        };
        let start = app.start("#app", foo);
        console.log(start);
    });
</script>

<div id="app"></div>
