<script>
    import { createEventDispatcher } from 'svelte';

    export let list;

    const dispatch = createEventDispatcher();
</script>

<ul>
    {#each list as deadUser}
        <li on:click={() => dispatch("restore" , deadUser)}>
            Restore {deadUser}
        </li>
    {/each}
</ul>

<style>
    li:hover {
        cursor: pointer;
        color: green;
    }
</style>