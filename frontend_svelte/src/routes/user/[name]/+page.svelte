<script>
  export let data;
  console.log({ data });
</script>

{#if data.error}
  {data.error}
{:else}
  {JSON.stringify(data.user)}
{/if}
