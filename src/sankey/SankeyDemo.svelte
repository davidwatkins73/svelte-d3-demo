<script>
    import _ from "lodash";
    import {onDestroy} from "svelte"

    import {mkData} from "./data.js"
    import {colorBySource} from "./config-store"
    import Sankey from "./Sankey.svelte";

    let chartData = _.map(_.range(20), () => mkData());

    let interval = null;

    function toggleAnimation() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        } else {
            interval = setInterval(
                () => chartData[Math.floor(Math.random() * chartData.length)] = mkData(),
                600);
        }
    }

    toggleAnimation();

    onDestroy(() => interval && clearInterval(interval));

</script>


<div class="charts" style="display: inline-block; width: 65%">
    {#each chartData as d}
    <span on:click={() => d = mkData()} class="clickable">
        <Sankey data={d}/>
    </span>
    {/each}
</div>

<div class="info">
    <p>Experimenting with lots of tiny sankeys.</p>
    <p>Click on a sankey chart to randomise the data.</p>
    <p>Use the checkbox below to configure how the links are coloured (by-source or by-target)</p>

    <label for="color-by">
        Colour by Source:
        <input id="color-by"
               type="checkbox"
               bind:checked={$colorBySource}>
    </label>

    <br>

    <button on:click={() => chartData = [...chartData, mkData()]}>
        Mwoar
    </button>
    <button on:click={() => toggleAnimation()}>
        {interval ? "Disable" : "Enable"} Animation
    </button>
</div>

<style>

    .charts {
        user-select: none;
    }

    .info {
        display: inline-block;
        width: 30%;
        vertical-align: top;
        color: #777;
        font-size: smaller;
    }

    .info label {
        font-size: larger;
        color: #333
    }
</style>