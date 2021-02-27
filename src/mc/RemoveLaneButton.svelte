<script>
    import * as d3 from "d3";
    import { createEventDispatcher } from 'svelte';

    const cross = d3.symbol(d3.symbolCross, 80)();
    const dispatch = createEventDispatcher();
</script>

<path d={cross}
      on:click={() => dispatch('remove')}
      class="remove">
</path>

<style>
    .remove {
        fill: #ccc;
        stroke: #ff8787;
        stroke-width: 0.5;
        transition: transform 0.3s, fill 0.3s;
        transform: rotate(45deg);
    }

    .remove:hover {
        cursor: pointer;
        transform: rotate(60deg);
        fill: red;
    }
</style>