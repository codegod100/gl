<script lang="ts">
    import { onMount } from "svelte";
    import { foo_start } from "$lib/gl";
    export let data;
    console.log(data.jane);
    let jane = JSON.parse(data.jane);
    onMount(async () => {
        foo_start("#gleam", {
            name: jane.username,
            sport: new Date(jane.birthday).toDateString(),
        });
    });
</script>

<div><a href="/cat">Go cat</a></div>
<div id="gleam"></div>
