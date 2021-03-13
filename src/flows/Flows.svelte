<script>
    import _ from "lodash";
    import * as d3 from "d3";

    import {mkDataSet} from "./data";
    import {selectedFacet} from "./stores/options";
    import {mkPathData} from "./util";

    let el;

    export let data = mkDataSet({sourceCount: 100, targetCount: 200});

    let width = 1000;
    let height = 1000;

    $: inFacet = _.find(data.inbound.facets, {id: $selectedFacet});
    $: outFacet = _.find(data.outbound.facets, {id: $selectedFacet});
    $: facetDomain = _.find(data.facetDomains, {id: $selectedFacet});

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

    $: inData = mkStackData(inFacet.values);
    $: outData = mkStackData(outFacet.values);
    $: midY = d3
        .scaleBand()
        .domain(_.map(facetDomain.domain, "id"))
        .range([250, 750])
        .padding(0.3)


    let inPaths = [];
    let outPaths = [];

    $: {
        const inY = d3
            .scaleLinear()
            .range([0, 1000])
            .domain([0, Math.max(inData.total, outData.total)]);


        const outY = d3
            .scaleLinear()
            .range([0, 1000])
            .domain([0, Math.max(inData.total, outData.total)]);

        inPaths = _.map(
            inData.values,
            d => mkPathData(
                inY(d.y),
                inY(d.y + d.h) - inY(d.y),
                midY(d.k),
                midY.bandwidth(),
                width / 3,
                0.7));

        outPaths = _.map(
            outData.values,
            d => mkPathData(
                midY(d.k),
                midY.bandwidth(),
                outY(d.y),
                outY(d.y + d.h) - outY(d.y),
                width / 3,
                0.7));

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
     width="100%"
     bind:this={el}
     style="border: 1px solid red">
    <g transform="translate(0 20)">
        {#each inPaths as pathData, idx}
            <path d={pathData}
                  stroke="red"
                  fill="pink"
                  style="opacity: 0.4"/>
        {/each}
    </g>
    <g transform="translate({width / 3 * 2} 20)">
        {#each outPaths as pathData, idx}
            <path d={pathData}
                  stroke="green"
                  fill="lightgrey"
                  style="opacity: 0.4"/>
        {/each}
    </g>
    <g transform="translate({width / 2} 20)">
        {#each facetDomain.domain as domainItem, idx}
            <rect x={width / 3 - width / 2}
                  y={midY(domainItem.id)}
                  width={width/3}
                  height={midY.bandwidth()}
                  fill="#eee"/>
            <text dy={midY(domainItem.id) + midY.bandwidth() * 0.5 + 6 }
                  text-anchor="middle">
                {domainItem.name}
            </text>
        {/each}

    </g>
</svg>

