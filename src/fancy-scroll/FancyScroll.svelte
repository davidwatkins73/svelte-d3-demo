<script>
    import {categories, categoryScale, clients, clientScale, clientScrollOffset} from "./fancy-store";
    import Categories from "./Categories.svelte";
    import Clients from "./Clients.svelte";
    import _ from "lodash";
    import * as d3 from "d3";

    function randomPick(xs) {
        if (!xs) throw new Error("Cannot pick from a null set of options");

        const choiceCount = xs.length - 1;
        const idx = Math.round(Math.random() * choiceCount);
        return xs[idx];
    }

    let svgElem;

    $categories = ["A", "B", "C", "D", "E"];

    $clients = _
        .range(0, 200)
        .map(d => ({
            name: `c${d}`,
            id: d,
            cat: randomPick(["A", "B", "C", "D", "E", "B", "B", "D"])
        }));

    function onScroll(evt) {
        clientScrollOffset.update(d => {
            const nv = d + evt.sourceEvent.wheelDeltaY;
            return _.clamp(nv, ($clients.length * 20) * -1, 20)
        });
    }

    $: d3
        .select(svgElem)
        .call(d3
            .zoom()
            .on("zoom", onScroll));

    $: {
        const start = ($clientScrollOffset * -1) -10;
        const end = ($clientScrollOffset * -1) + 490;
        _.forEach($clients, c => {
            const pos = $clientScale(c.id);
            d3.select(`line[data-id="${c.id}"`)
                .classed("showing", pos > start && pos < end);

        })
    }


</script>


<div >
    <svg bind:this={svgElem}
         viewBox="0 0 500 500"
         width="400"
         height="400">
         <clipPath id="row-clip">
            <rect x="0"
                  y="0"
                  width="500"
                  height="500"/>
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
            {#each $clients as client, idx}
                <line x1={150}
                      data-id={client.id}
                      x2={400}
                      y1={$categoryScale(client.cat) + $categoryScale.bandwidth() / 2}
                      y2={$clientScale(client.id) + $clientScrollOffset + $clientScale.bandwidth() / 2}
                      stroke="red"/>
            {/each}
        </g>
    </svg>
</div>

<style>
    svg {
        margin: 10px;
        border: 1px solid green;
    }

    line {
        opacity: 0.07;
        stroke-width: 0.5;
        transition: opacity, stroke-width 0.2s;
    }

    :global(line.showing) {
        opacity: 0.7;
        stroke-width: 1.5;

    }
</style>
