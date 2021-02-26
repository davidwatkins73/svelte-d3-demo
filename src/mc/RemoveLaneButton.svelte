<script>
    import * as d3 from "d3";
    import { createEventDispatcher } from 'svelte';

    const cross = d3.symbol(d3.symbolCross, 80)();

    const dispatch = createEventDispatcher();

</script>

<path d={cross}
      fill="#ccc"
      class="remove"
      on:click={() => dispatch('remove')}/>


<style>
    .remove:hover {
        cursor: pointer;
        fill: red;
    }
</style>