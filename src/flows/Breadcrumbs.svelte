<script>
    import {history, rewind, activeRoot} from "./stores/options";
</script>
<text class="history"
      dy="20"
      dx="10">
    {#each $history as h}
        <tspan class="history-link"
               on:click={() => rewind(h)}>
            {h.data.name}
        </tspan>
        <tspan>
            &raquo;
        </tspan>
    {/each}
    <tspan class="history-active-root">
        {$activeRoot?.data?.name}
    </tspan>
</text>

<style>
    .history {
        font-size: 1.2em;
    }

    .history-link {
        cursor: pointer;
        fill: #146aba
    }

    .history-active-root {
        fill: #aaa
    }
</style>
