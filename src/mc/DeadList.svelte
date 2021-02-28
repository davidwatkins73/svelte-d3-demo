<script>
    import _ from "lodash";

    import {killList} from "./stores/filters-store";


    function restore(u) {
        killList.update(xs => _.without(xs, u));
    }
</script>

<ul>
    {#each _.orderBy($killList) as deadUser}
    <li>
        <button class="link"
                on:click={() => restore(deadUser)}>
            {deadUser}
        </button>
    </li>
    {:else}
        <li class="info">Click on the 'x' to remove contributors from graph</li>
    {/each}
</ul>

<style>

    ul {
        margin-top: 0;
    }

    li {
        list-style: none;
    }

    .info {
        color: #888
    }

</style>