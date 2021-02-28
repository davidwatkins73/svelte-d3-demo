<script>
    import * as d3 from "d3";
    import { createEventDispatcher } from 'svelte';

    export let height;

    const cross = d3.symbol(d3.symbolCross, 80)();

    let dispatch = createEventDispatcher();
 </script>


<g class="remove"
   on:click={() => dispatch('remove')}>
    <rect fill="none"
          stroke="none"
          width="20"
          {height}>
    </rect>
    <g transform="translate(10 {height / 2})">
        <path d={cross}></path>
    </g>
</g>


<style>
    g {
        pointer-events: all;
    }

    .remove path {
        fill: #ccc;
        stroke: #ff8787;
        stroke-width: 0.5;
        transition: transform 0.3s, fill 0.3s;
        transform: rotate(45deg);
    }

    .remove:hover {
        cursor: pointer;
    }

    .remove:hover path {
        transform: rotate(60deg);
        fill: red;
    }
</style>