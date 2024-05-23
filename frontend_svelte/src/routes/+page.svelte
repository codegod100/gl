<script>
    export let data;
</script>

<div>Current users in database</div>
{#each data.users as user}
    <div>{user.name}</div>
{/each}
<div><a href="/cat">Go cat</a></div>
