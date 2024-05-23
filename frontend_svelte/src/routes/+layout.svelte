<script>
	import "../app.postcss";
	export let data;
</script>

{#if data.user}
	<div class="flex">
		<div class="mr-5 text-2xl">Hello {data.user.name}</div>
		<form method="POST" action="/">
			<input type="hidden" name="logout" value="true" />
			<button type="submit" class="btn variant-filled mb-1 p-2"
				>Logout</button
			>
		</form>
	</div>
{/if}
<slot />
