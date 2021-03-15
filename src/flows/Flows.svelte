<script>
    import _ from "lodash";
    import * as d3 from "d3";

    import {mkDataSet} from "./data";
    import {selectedFacet, history} from "./stores/options";
    import {layout, mkPathData, mkStackData} from "./util";

    export let data = mkDataSet({sourceCount: 100, targetCount: 250});

    let el;

    let width = 1000;
    let height = 1000;

    let midPaddingOuter = 3.5;
    let midPaddingInner = 0.2;
    let endpointPadding = 12;
    let tension = 0.7;
    let inPaths = [];
    let outPaths = [];
    let mids = [];

    let activeDomainItems = [];

    let domainTree = null;
    let activeRoot = null;


    $: {
        const root = {id: -13, name: "Root"};
        const domain = _.map(
            facetDomain.values,
            d => Object.assign(
                {},
                d,
                {parentId: d.parentId ? d.parentId : root.id}));

        domainTree = d3.stratify()(_.concat([root], domain));
        activeRoot = domainTree;
    }

    $: activeDomainItems = _.map(
            activeRoot.children,
            d => ({...d, rollups: _.map(d.descendants(), c => c.id)}));

    $: inFacet = _.find(data.inbound.facets, {id: $selectedFacet});
    $: outFacet = _.find(data.outbound.facets, {id: $selectedFacet});
    $: facetDomain = _.find(data.facetDomains, {id: $selectedFacet});
    $: inData = mkStackData(inFacet.values, activeDomainItems);
    $: outData = mkStackData(outFacet.values, activeDomainItems);

    $: layoutData = layout(
            inData,
            outData,
            activeDomainItems,
            height,
            midPaddingOuter,
            midPaddingInner,
            endpointPadding);

    $: mids = layoutData.mid;

    $: inPaths = _.map(
            layoutData.in,
            d => mkPathData(
                d.sy,
                d.sh,
                d.ey,
                d.eh,
                width / 3,
                tension));

    $: outPaths = _.map(
            layoutData.out,
            d => mkPathData(
                d.sy,
                d.sh,
                d.ey,
                d.eh,
                width / 3,
                tension));


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


    function drillIn(mid) {
        if (_.isEmpty(mid.data.children)) return;
        history.update(xs => [...xs, activeRoot]);
        activeRoot = mid.data
    }

    function rewind(mid) {
        history.update(xs => _.takeWhile(xs, x => x !== mid))
        activeRoot = mid;
    }
</script>

<h1>Flows</h1>

<svg viewBox="0 0 {width} {height}"
     width="70%"
     bind:this={el}
     style="border: 1px solid #eee">
    <g transform="translate(0 0)"
       class="inbound">
        {#each inPaths as pathData, idx}
            <path d={pathData}
                  class="flow in-flow"/>
        {/each}
    </g>
    <g transform="translate({width / 3 * 2} 0)"
       class="outbound">
        {#each outPaths as pathData, idx}
            <path d={pathData}
                  class="flow out-flow"/>
        {/each}
    </g>
    <g transform="translate({width / 2} 0)" class="middle">
        {#each mids as mid}
            <rect x={width / 6 * -1}
                  y={mid.y}
                  width={width / 3}
                  height={mid.h}
                  stroke="#ccc"
                  fill="#eee"
                  on:click={() => drillIn(mid)}/>
            <text dy={mid.y + mid.h * 0.5 + 6 }
                  text-anchor="middle">
                {mid.data.data.name}
                {mid.data.children ? "+" : "-" }
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
            Mid Band Outer Padding ({midPaddingOuter})
        </td>
        <td>
            <input type="range"
                   min="0"
                   max="10"
                   step="0.05"
                   bind:value={midPaddingOuter}/>
        </td>
        <td>
            Tension ({tension})
        </td>
        <td>
            <input type="range"
                   min="0"
                   max="1"
                   step="0.05"
                   bind:value={tension}/>
        </td>
    </tr>
    <tr>
        <td>
            Mid Band Inner Padding ({midPaddingInner})
        </td>
        <td>
            <input type="range"
                   min="0"
                   max="1"
                   step="0.05"
                   bind:value={midPaddingInner}/>
        </td>
        <td>
            History
        </td>
        <td>
            <ul class="history">
                {#each $history as h}
                    <li>
                        <button on:click={() => rewind(h)}
                                class="link">
                            {h.data.name}
                        </button>
                    </li>
                {/each}
            </ul>
        </td>
    </tr>
    <tr>
        <td>Endpoint Padding ({endpointPadding})</td>
        <td><input type="range" min="0" max="100" bind:value={endpointPadding}/></td>
        <td>Height ({height})</td>
        <td><input type="range" min="0" max="2000" bind:value={height}/></td>
    </tr>
    <tr>
        <td>-</td>
        <td>-</td>
        <td>Width ({width})</td>
        <td><input type="range" min="0" max="2000" bind:value={width}/></td>
    </tr>
</table>


<style>
    .flow {
        opacity: 0.4;
    }

    .out-flow {
        fill: #baf4f6;
        stroke: #aaa;
        /*fill: #fdde97;*/
        /*stroke: #f6c50b;*/
    }

    .in-flow {
        fill: #baf4f6;
        stroke: #aaa;
    }

    .history {
        list-style: none;
    }

</style>
