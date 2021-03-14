<script>
    import _ from "lodash";
    import * as d3 from "d3";

    import {mkDataSet} from "./data";
    import {selectedFacet} from "./stores/options";
    import {mkPathData} from "./util";

    function mkStackData(values) {
        return _
            .chain(values)
            .countBy(d => d.ref)
            .reduce(
                (acc, v, k) => {
                    const d = {
                        k,
                        y: acc.total,
                        h: v
                    };
                    acc.values.push(d);
                    acc.total += v;
                    return acc;
                },
                {total: 0, values: []})
            .value();
    }

    export let data = mkDataSet({sourceCount: 250, targetCount: 100});

    let el;

    let width = 1000;
    let height = 1000;

    let midPadding = 0.2;
    let tension = 0.7;
    let inPaths = [];
    let outPaths = [];

    $: inFacet = _.find(data.inbound.facets, {id: $selectedFacet});
    $: outFacet = _.find(data.outbound.facets, {id: $selectedFacet});
    $: facetDomain = _.find(data.facetDomains, {id: $selectedFacet});
    $: inData = mkStackData(inFacet.values);
    $: outData = mkStackData(outFacet.values);
    $: midY = d3
        .scaleBand()
        .domain(_.map(facetDomain.domain, "id"))
        .range([height * midPadding, height - (midPadding * height)])
        .padding(midPadding)

    $: {
        const commonY = d3
            .scaleLinear()
            .range([0, height])
            .domain([0, Math.max(inData.total, outData.total)]);

        const inY = d3
            .scaleLinear()
            .range([
                height / 2 - (commonY(inData.total) / 2),
                height / 2 + (commonY(inData.total) / 2)
            ])
            .domain([0, inData.total]);

        const outY = d3
            .scaleLinear()
            .range([
                height / 2 - (commonY(outData.total) / 2),
                height / 2 + (commonY(outData.total) / 2)
            ])
            .domain([0, outData.total]);

        inPaths = _.map(
            inData.values,
            d => mkPathData(
                inY(d.y),
                inY(d.y + d.h) - inY(d.y),
                midY(d.k),
                midY.bandwidth(),
                width / 3,
                tension));

        outPaths = _.map(
            outData.values,
            d => mkPathData(
                midY(d.k),
                midY.bandwidth(),
                outY(d.y),
                outY(d.y + d.h) - outY(d.y),
                width / 3,
                tension));
    }


    $: console.log({
        data,
        inFacet,
        outFacet,
        facetDomain,
        selectedFacet: $selectedFacet,
        inData,
        outData,
        inPaths
    });

</script>

<h1>Flows</h1>

<svg viewBox="0 0 {width} {height}"
     width="70%"
     bind:this={el}
     style="border: 1px solid red">
    <g transform="translate(0 0)">
        {#each inPaths as pathData, idx}
            <path d={pathData}
                  class="flow in-flow"
                  style="opacity: 0.4"/>
        {/each}
    </g>
    <g transform="translate({width / 3 * 2} 0)">
        {#each outPaths as pathData, idx}
            <path d={pathData}
                  class="flow out-flow"
                  style=""/>
        {/each}
    </g>
    <g transform="translate({width / 2} 0)">
        {#each facetDomain.domain as domainItem, idx}
            <rect x={width / 3 - width / 2}
                  y={midY(domainItem.id)}
                  width={width/3}
                  height={midY.bandwidth()}
                  stroke="#ccc"
                  fill="#eee"/>
            <text dy={midY(domainItem.id) + midY.bandwidth() * 0.5 + 6 }
                  text-anchor="middle">
                {domainItem.name}
            </text>
        {/each}

    </g>
</svg>

<h3>Controls</h3>
<table width="100%">
    <colgroup>
        <col width="25%">
        <col width="25%">
        <col width="25%">
        <col width="25%">
    </colgroup>
    <tr>
        <td>
            Mid Padding ({midPadding})
        </td>
        <td>
            <input type="range" min="0" max="1" step="0.05" bind:value={midPadding}/>
        </td>
        <td>
            Tension ({tension})
        </td>
        <td>
            <input type="range" min="0" max="1" step="0.05" bind:value={tension}/>
        </td>
    </tr>
    <tr>
        <td>
            Mid Padding ({midPadding})
        </td>
        <td>
            <input type="range" min="0" max="1" step="0.05" bind:value={midPadding}/>
        </td>
        <td>

        </td>
        <td>
            <input type="range" min="0" max="1" step="0.05" bind:value={tension}/>
        </td>
    </tr>
</table>


<style>
    .flow {
        opacity: 0.4;
    }

    .out-flow {
        fill: #fdde97;
        stroke: #f6c50b;
    }

    .in-flow {
        fill: #bdf8bd;
        stroke: #08c608;
    }
</style>
