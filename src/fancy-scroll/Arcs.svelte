<script>
    import {
        categoryScale,
        clientScale,
        clientScrollOffset,
        filteredArcs,
        layout,
        ratingColors} from "./fancy-store";
    import _ from "lodash";
    import {dimensions} from "./fancy-utils";

    function calcScreenArcs(offset, clientY, categoryY, arcs) {
        const start = (offset * -1) - 10;
        const end = (offset * -1) + 490;
        return _.map(
            arcs,
            a => {
                const left = $layout.left;
                const right = $layout.right;

                const calcY = (direction, a) => direction.scale(direction.id(a))
                    + direction.offset(offset)
                    + direction.scale.bandwidth() / 2

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

    const tipSpace = 1 - 0.97;

    $: screenArcs = calcScreenArcs(
        $clientScrollOffset,
        $clientScale,
        $categoryScale,
        $filteredArcs);

    $: screenDefs = _
        .chain(screenArcs)
        .filter(d => d.showing)
        .map(d => {
            const total = _.sumBy(
                d.arc.tipRatings,
                r => r.count);

            let currentStop = 0.97;

            const colorStops = _
                .chain(d.arc.tipRatings)
                .filter(t => t.count > 0)
                .map(t => {
                    const colorSpaceNeeded = t.count / total * tipSpace;
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
            };
        })
        .value();


</script>

<defs>
    {#each screenDefs as def}
        <linearGradient id={def.id}>
            <stop stop-color={def.color} offset="0"/>
            <stop stop-color={def.color} offset="0.95"/>
            {#each def.colorStops as colorStop}
                <stop stop-color={colorStop.color} offset={colorStop.offsetStart}/>
                <stop stop-color={colorStop.color} offset={colorStop.offsetEnd}/>
            {/each}
        </linearGradient>
    {/each}
</defs>

{#each screenArcs as arc}
    <line x1={arc.x1}
          x2={arc.x2}
          y1={arc.y1}
          y2={arc.y2}
          class={arc.showing ? "showing" : ""}
          stroke={arc.showing ? arc.defId : arc.color}/>
{/each}

<style>
    line {
        opacity: 0.1;
        stroke-width: 0.5;
        xxtransition: opacity, stroke-width 1s;
        transition: transform 1s;
    }

    :global(line.showing) {
        opacity: 0.7;
        stroke-width: 1.5;
    }
</style>