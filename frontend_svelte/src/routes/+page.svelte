<script lang="ts">
    import { onMount } from "svelte";
    import { invalidateAll } from "$app/navigation";

    export let data;
    export let form;
    let username: string;
    let password: string;
    let hash: string;
</script>

<div class="mt-1">
    {#if !data.user}
        <div>{form?.error || ""}</div>
        <form method="POST" action="/">
            <input
                name="username"
                class="input filled mb-1 p-2 w-40"
                type="text"
                bind:value={username}
            />
            <input
                name="password"
                bind:value={password}
                type="password"
                class="input filled mb-1 p-2 w-40"
            />
            <button type="submit" class="btn variant-filled">Login</button>
        </form>
    {:else}
        <div>Sup {data.user.name}</div>
        <div>Main page <a class="anchor" href="/cat">Go cat</a></div>
    {/if}
</div>
