<script>
    import _ from "lodash";

    import {mkDataSet} from "./data";
    import {selectedFacet} from "./stores/options";
    import {layout, mkPathData, mkStackData} from "./util";

    export let data = mkDataSet({sourceCount: 50, targetCount: 400});

    let el;

    let width = 1000;
    let height = 1000;

    let midPaddingOuter = 3.5;
    let midPaddingInner = 0.2;
    let tension = 0.7;
    let inPaths = [];
    let outPaths = [];
    let mids = [];

    $: inFacet = _.find(data.inbound.facets, {id: $selectedFacet});
    $: outFacet = _.find(data.outbound.facets, {id: $selectedFacet});
    $: facetDomain = _.find(data.facetDomains, {id: $selectedFacet});
    $: inData = mkStackData(inFacet.values);
    $: outData = mkStackData(outFacet.values);


    $: {
        const layoutData = layout(
            inData,
            outData,
            facetDomain,
            midPaddingOuter,
            midPaddingInner);

        inPaths = _.map(
            layoutData.in,
            d => mkPathData(
                d.sy,
                d.sh,
                d.ey,
                d.eh,
                width / 3,
                tension));

        outPaths = _.map(
            layoutData.out,
            d => mkPathData(
                d.sy,
                d.sh,
                d.ey,
                d.eh,
                width / 3,
                tension));

        mids = layoutData.mid
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
    <g transform="translate(0 0)" class="inbound">
        {#each inPaths as pathData, idx}
            <path d={pathData}
                  class="flow in-flow"/>
        {/each}
    </g>
    <g transform="translate({width / 3 * 2} 0)" class="outbound">
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
                  fill="#eee"/>
            <text dy={mid.y + mid.h * 0.5 + 6 }
                  text-anchor="middle">
                {mid.data.name}
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

        </td>
        <td>
            <input type="range"
                   min="0"
                   max="1"
                   step="0.05"
                   bind:value={tension}/>
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
