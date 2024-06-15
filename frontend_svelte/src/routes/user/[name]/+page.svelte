<script>
  export let data;
</script>

{#if data.error}
  {data.error}
{:else}
  {JSON.stringify(data.user)}
{/if}
