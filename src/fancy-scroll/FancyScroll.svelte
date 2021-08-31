<script>
    import {
        categories,
        clients,
        arcs,
        clientScale,
        clientScrollOffset,
        clientQry,
        categoryQry,
        layout,
        layoutDirections,
        layoutDirection} from "./fancy-store";
    import Categories from "./Categories.svelte";
    import Clients from "./Clients.svelte";
    import {dimensions} from "./fancy-utils";
    import {mkClients, mkCategories, mkArcs} from "./fancy-demo-data";
    import _ from "lodash";
    import * as d3 from "d3";
    import Arcs from "./Arcs.svelte";


    function onScroll(evt) {
        clientScrollOffset.update(origValue => {
            const dy = evt.sourceEvent.wheelDeltaY;

            const minY = _.clamp(
                $clientScale.range()[1] * -1 + 480,
                0);

            return dy
                ? _.clamp(
                    origValue + dy,
                    minY,
                    dimensions.clientList.paddingTop)
                : origValue;
        });
    }

    let svgElem;
    let directionToggle = false;

    $categories = mkCategories();
    $clients = mkClients();
    $arcs = mkArcs($clients, $categories);

    $: d3
        .select(svgElem)
        .call(d3
            .zoom()
            .on("zoom", onScroll));


    $: $layoutDirection = directionToggle
        ? layoutDirections.clientToCategory
        : layoutDirections.categoryToClient

</script>

<div class="row">
    <label for="toggle-direction">
        Toggle direction:
        <input id="toggle-direction"
               type="checkbox"
               bind:checked={directionToggle}>
    </label>
    Filter categories: <input type="text" bind:value={$categoryQry}/>
    Filter clients: <input type="text" bind:value={$clientQry}/>
</div>

<div class="row">
    <svg bind:this={svgElem}
         viewBox={`0 0 ${dimensions.diagram.width} ${dimensions.diagram.height}`}
         width="700"
         height="500">

        <clipPath id="row-clip">
            <rect x="0"
                  y="0"
                  width={dimensions.client.width}
                  height={dimensions.diagram.height}/>
        </clipPath>

        <g id="categories"
           transform={`translate(${$layout.categoryTranslateX}, 0)`}>
            <Categories/>
        </g>

        <g id="clients"
           clip-path="url(#row-clip)"
           transform={`translate(${$layout.clientTranslateX}, 0)`}>
            <Clients/>
        </g>

        <g id="arcs">
            <Arcs/>
        </g>
    </svg>
</div>

<style>
    svg {
        margin: 10px;
        padding: 6px;
        border: 1px solid #eee;
    }

</style>
