<script lang="ts">
	import { onMount } from "svelte";
	export let data;

	import "../app.postcss";
</script>

<div class="mt-1">
	{#if data.user}
		Hello {data.user.name}
		<button on:click={() => {}} class="btn variant-filled mb-1"
			>Logout</button
		>

		<slot />
	{:else}
		<button on:click={() => {}} class="btn variant-filled">Login</button>
	{/if}
</div>
