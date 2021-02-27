<script>
    import { createEventDispatcher } from 'svelte';

    export let list;

    const dispatch = createEventDispatcher();
</script>

{#if list}
    <div>
        Restore:
        <ul>
            {#each list as deadUser}
                <li >
                    <a on:click={() => dispatch("restore" , deadUser)}
                       class="clickable">
                        {deadUser}
                    </a>
                </li>
            {/each}
        </ul>
    </div>
{/if}

<style>
    div {
        padding-left: 2em;
        text-align: left;
    }

    ul {
        display: inline-block;
    }

    li {
        display: inline-block;
    }

    li::after {
        content: "|";
        padding-left: 1em;
        padding-right: 1em;
    }

    li:last-child:after {
        content: '';
    }

    li:hover {
        color: green;
    }

</style>