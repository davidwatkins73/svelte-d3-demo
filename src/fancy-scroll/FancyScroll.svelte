<script>
    import {
        categories,
        categoryScale,
        clients,
        filteredClients,
        arcs,
        filteredArcs,
        clientScale,
        clientScrollOffset,
        ratingColors,
        clientQry,
        categoryQry} from "./fancy-store";
    import Categories from "./Categories.svelte";
    import Clients from "./Clients.svelte";
    import {mkCategories, mkClients, mkArcs, dimensions} from "./fancy-utils"
    import _ from "lodash";
    import * as d3 from "d3";

    let svgElem;

    $categories = mkCategories();
    $clients = mkClients();

    $arcs = mkArcs($clients, $categories);

    function onScroll(evt) {

        clientScrollOffset.update(origValue => {
            const dy = evt.sourceEvent.wheelDeltaY;

            const minY = _.clamp(
                (($filteredClients.length * dimensions.client.height) * -1) + 480,
                0);

            return dy
                ? _.clamp(origValue + dy, minY, dimensions.clientList.paddingTop)
                : origValue;
        });
    }

    $: d3
        .select(svgElem)
        .call(d3
            .zoom()
            .on("zoom", onScroll));

    function updateShowing(offset, clientY, categoryY, arcs) {
        const start = (offset * -1) - 10;
        const end = (offset * -1) + 490;
        return _.map(
            arcs,
            a => {
                const pos = clientY(a.clientId);
                const y1 = categoryY(a.categoryId) + dimensions.category.height / 2;
                const y2 = pos + offset + clientY.bandwidth() / 2;
                const showing = pos > start && pos < end;
                return {
                    x1: dimensions.category.width,
                    x2: 400,
                    y1,
                    y2,
                    showing,
                    color: ratingColors(a.ratingId)
                };
            });
    }

    $: screenArcs = updateShowing($clientScrollOffset, $clientScale, $categoryScale, $filteredArcs);

</script>

<div class="row">
    Filter categories: <input type="text" bind:value={$categoryQry}/>
    Filter clients: <input type="text" bind:value={$clientQry}/>
</div>
<div class="row">
    <svg bind:this={svgElem}
         viewBox={`0 0 ${dimensions.diagram.width} ${dimensions.diagram.height}`}
         width="400"
         height="400">
         <clipPath id="row-clip">
            <rect x="0"
                  y="0"
                  width={dimensions.client.width}
                  height={dimensions.diagram.height}/>
        </clipPath>

        <g id="categories">
            <Categories/>
        </g>

        <g id="clients"
           clip-path="url(#row-clip)"
           transform="translate(400, 0)">
            <Clients/>
        </g>

        <g id="arcs">
        {#each screenArcs as arc}
                <line x1={arc.x1}
                      x2={arc.x2}
                      y1={arc.y1}
                      y2={arc.y2}
                      class={arc.showing ? "showing" : ""}
                      stroke={arc.color}/>
            {/each}
        </g>
    </svg>
</div>

<style>
    svg {
        margin: 10px;
        xxborder: 1px solid green;
    }

    line {
        opacity: 0.07;
        stroke-width: 0.5;
        transition: opacity, stroke-width 1s;
    }

    :global(line.showing) {
        opacity: 0.7;
        stroke-width: 1.5;
    }
</style>
