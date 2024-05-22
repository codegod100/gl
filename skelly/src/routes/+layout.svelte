<script lang="ts">
	import { browser } from "$app/environment";
	import { onMount } from "svelte";
	export let data;
	onMount(() => {
		// if (!data.user) {
		// 	data.user = prompt("username") || "";
		// 	document.cookie = `user=${data.user}`;
		// }
	});

	function renameUser() {
		data.user = prompt("username") || "";
		document.cookie = `user=${data.user}`;
	}

	function clearUser() {
		data.user = "";
	}

	import "../app.postcss";
</script>

<div class="mt-1">
	{#if data.user}
		Hello <span on:click={renameUser}>{data.user}</span>
		<button on:click={clearUser} class="btn variant-filled mb-1"
			>Logout</button
		>

		<slot />
	{:else}
		<button on:click={renameUser} class="btn variant-filled">Login</button>
	{/if}
</div>
