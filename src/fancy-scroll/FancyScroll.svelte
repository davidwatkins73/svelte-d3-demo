<script>
    import {categories, categoryScale, clients, arcs, clientScale, clientScrollOffset} from "./fancy-store";
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
        .range(0, 140)
        .map(d => ({
            name: `c${d}`,
            id: d,
            cat: randomPick(["A", "B", "C", "D", "E", "B", "B", "D"])
        }));


    $arcs = _
        .chain($clients)
        .flatMap(d => _.map(
            _.range(Math.ceil(Math.random() * 5)),
            () => ({
                clientId: d.id,
                categoryId: randomPick(["A", "B", "C", "D", "E", "B", "B", "D"]),
                color: randomPick(["blue", "green", "red", "pink", "grey"])
            })))
        .value();

    function onScroll(evt) {
        clientScrollOffset.update(origValue => {
            const dy = evt.sourceEvent.wheelDeltaY;
            return dy
                ? _.clamp(origValue + dy, (($clients.length * 20) * -1) + 480, 20)
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
                const y1 = categoryY(a.categoryId) + categoryY.bandwidth() / 2;
                const y2 = pos + offset + clientY.bandwidth() / 2;
                const showing = pos > start && pos < end;
                return {
                    x1: 150,
                    x2: 400,
                    y1,
                    y2,
                    showing,
                    color: a.color
                };
            });
    }

    $: screenArcs = updateShowing($clientScrollOffset, $clientScale, $categoryScale, $arcs);


    $: console.log({arcs: $arcs});
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
        border: 1px solid green;
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
