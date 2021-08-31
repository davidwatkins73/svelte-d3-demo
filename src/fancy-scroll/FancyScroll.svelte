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
        categoryQry,
        layout,
        layoutDirections,
        layoutDirection} from "./fancy-store";
    import Categories from "./Categories.svelte";
    import Clients from "./Clients.svelte";
    import {mkCategories, mkClients, mkArcs, dimensions, randomPick} from "./fancy-utils"
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
                $clientScale.range()[1] * -1 + 480,  //(($filteredClients.length * dimensions.client.height) * -1.2) + 480,
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
                const left = $layout.left;
                const right = $layout.right;

                const calcY = (direction, a) => direction.scale(direction.id(a)) + direction.offset(offset) + direction.dimensions.height / 2

                const pos = clientY(a.clientId);
                const showing = pos > start && pos < end;

                return {
                    x1: left.dimensions.width,
                    x2: dimensions.diagram.width - right.dimensions.width,
                    y1: calcY(left, a),
                    y2: calcY(right, a),
                    showing,
                    defId: `url(#grad_${a.id})`,
                    arc: a,
                    color: ratingColors(a.ratingId),
                };
            });
    }

    $: screenArcs = updateShowing($clientScrollOffset, $clientScale, $categoryScale, $filteredArcs);


    $: screenDefs = _
        .chain(screenArcs)
        .filter(d => d.showing)
        .map(d => {
            const total = _.sumBy(d.arc.tipRatings, r => r.count);
            console.log({total})

            let tipSpace = 1 - 0.97;
            let currentStop = 0.97;

            const colorStops = _
                .chain(d.arc.tipRatings)
                .filter(t => t.count > 0)
                .map(t => {
                    // const offsetStart = currentStop;
                    const colorSpaceNeeded = t.count / total * tipSpace;

                    // currentStop = currentStop + colorSpaceNeeded;

                    return {color: ratingColors(t.ratingId), colorSpaceNeeded}
                })
                .orderBy(d => d.colorSpaceNeeded, 'desc')
                .map(d => {
                    const offsetStart = currentStop;
                    currentStop = currentStop + d.colorSpaceNeeded;

                    return Object.assign({}, d, {offsetStart, offsetEnd: currentStop})
                })
                .value()

            return {
                id: `grad_${d.arc.id}`,
                color: d.color,
                colorStops: colorStops,
            }})
        .value();

    let directionToggle = false;
    $: $layoutDirection = directionToggle ? layoutDirections.clientToCategory : layoutDirections.categoryToClient

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
         width="800"
         height="500">

        <defs>
            {#each screenDefs as def}
                <linearGradient id={def.id}>
                    <stop stop-color={def.color} offset="0"/>
                    <stop stop-color={def.color} offset="0.95"/>
<!--                    <stop stop-color="grey" offset="0.9"/>-->

                    {#each def.colorStops as colorStop}
                        <stop stop-color={colorStop.color} offset={colorStop.offsetStart}/>
                        <stop stop-color={colorStop.color} offset={colorStop.offsetEnd}/>
                    {/each}
                </linearGradient>
            {/each}
        </defs>

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
        {#each screenArcs as arc}
                <line x1={arc.x1}
                      x2={arc.x2}
                      y1={arc.y1}
                      y2={arc.y2}
                      class={arc.showing ? "showing" : ""}
                      stroke={arc.showing ? arc.defId : arc.color}/>
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
        xxtransition: opacity, stroke-width 1s;
    }

    :global(line.showing) {
        opacity: 0.7;
        stroke-width: 1.5;
    }
</style>
