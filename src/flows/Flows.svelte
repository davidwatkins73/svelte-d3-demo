<script>
    import _ from "lodash";
    import * as d3 from "d3";
    import {cubicOut, cubicInOut} from 'svelte/easing';
    import {tweened} from 'svelte/motion';

    import Defs from "./Defs.svelte";
    import IndicatorBar from "./IndicatorBar.svelte";
    import DomainBar from "./DomainBar.svelte";
    import {selectedFacet, history} from "./stores/options";
    import {hierarchyStack} from "./hierarchyStack";
    import {flowLayout} from "./flowLayout";
    import {arc, mkArcs} from "./arcs";

    import {mkDataSet} from "./data";

    export let data = mkDataSet({sourceCount: 100, targetCount: 250});

    let el;

    // overall dimensions of the chart
    let width = 1000;
    let height = 1000;

    // these control the ui layout
    let midPaddingOuter = 3.5;
    let midPaddingInner = 0.5;
    let endpointPadding = 12;
    let tension = 0.7;

    let domainTree = null;
    let activeRoot = null;

    let inArcs = [];
    let outArcs = [];
    let mids = [];

    const indicatorBarWidth = tweened(18, {duration: 400, easing: cubicInOut});

    $: layoutFn = flowLayout()
        .height(height)
        .midPaddingOuter(midPaddingOuter)
        .midPaddingInner(midPaddingInner)
        .endpointPadding(endpointPadding);

    $: arcFn = arc()
        .width(width / 3 - $indicatorBarWidth)
        .tension(tension);

    $: {
        const root = {id: -1, name: "Root"};
        const domain = _.map(
            facetDomain.values,
            d => ({
                ...d,
                parentId: d.parentId
                    ? d.parentId
                    : root.id
            }));

        domainTree = d3.stratify()(_.concat([root], domain));
        activeRoot = domainTree;
    }

    $: activeDomainItems = _
        .chain(activeRoot.children)
        .map(d => ({
            ...d,
            rollups: _.map(
                d.descendants(),
                c => c.id)
        }))
        .orderBy(d => d.data.name)
        .value();

    const hierStackFn = hierarchyStack();

    $: flowsById = _
        .chain([])
        .concat(data.inbound.flows, data.outbound.flows)
        .keyBy(d => d.id)
        .value();

    $: inFacet = _.find(data.inbound.facets, {id: $selectedFacet});
    $: outFacet = _.find(data.outbound.facets, {id: $selectedFacet});
    $: facetDomain = _.find(data.facetDomains, {id: $selectedFacet});
    $: inData = hierStackFn(inFacet.values, activeDomainItems);
    $: outData = hierStackFn(outFacet.values, activeDomainItems);
    $: layoutData = layoutFn(inData, outData, activeDomainItems);

    $: mids = layoutData.mid;
    $: inArcs = mkArcs(layoutData.in, arcFn);
    $: outArcs = mkArcs(layoutData.out, arcFn);

    /*
    $: console.log({
        data,
        inFacet,
        outFacet,
        facetDomain,
        selectedFacet: $selectedFacet,
        inData,
        outData,
        inArcs,
        outArcs,
        activeDomainItems,
        flowsById
    });
    */

    function drillIn(mid) {
        if (_.isEmpty(mid.data.children)) return;
        history.update(xs => [...xs, activeRoot]);
        activeRoot = mid.data
    }

    function rewind(mid) {
        history.update(xs => _.takeWhile(xs, x => x !== mid))
        activeRoot = mid;
    }

    function expandIndicatorBar() {
        indicatorBarWidth.set(100);
    }

    function collapseIndicatorBar() {
        indicatorBarWidth.set(18);
    }

    function mkIndicatorData(data) {
        return _
            .chain(data.values)
            .map(d => flowsById[d.flowId])
            .countBy(d => d.authorityRating)
            .value()
    }

</script>

<h1>Flows</h1>

<svg viewBox="0 0 {width} {height}"
     width="80%"
     bind:this={el}
     style="border: 1px solid #eee">
    <Defs/>
    <g transform="translate(0 0)"
       class="inbound">
        {#each inArcs as d}
            <path d={d.path}
                  transform="translate({$indicatorBarWidth} 0)"
                  fill="url(#gradient-in)"
                  filter="url(#glow)"
                  class="flow in-flow"/>
            <g transform="translate(0 {d.sy})">
                <IndicatorBar height={d.sh}
                              data={mkIndicatorData(d.data)}
                              on:mouseenter={expandIndicatorBar}
                              on:mouseleave={collapseIndicatorBar}
                              width={$indicatorBarWidth}/>
            </g>
        {/each}
    </g>
    <g transform="translate({width / 3 * 2} 0)"
       class="outbound">
        {#each outArcs as d}
            <path d={d.path}
                  fill="url(#gradient-out)"
                  filter="url(#glow)"
                  class="flow out-flow"/>
            <g transform="translate({(width / 3) - $indicatorBarWidth} {d.ey})">
                <IndicatorBar height={d.eh}
                              data={mkIndicatorData(d.data)}
                              on:mouseenter={expandIndicatorBar}
                              on:mouseleave={collapseIndicatorBar}
                              width={$indicatorBarWidth}/>
            </g>
        {/each}
    </g>
    <g transform="translate({width / 2} 0)" class="middle">
        {#each mids as mid}
            <DomainBar item={mid}
                       width={width / 3}
                       x={width/6 * -1}
                       on:click={() => drillIn(mid)}/>
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
        <td>Indicator Bar Width ({Math.round($indicatorBarWidth)})</td>
        <td>
<!--            <input type="range" min="0" max="100" bind:value={indicatorBarWidth}>-->
            <button on:click={() => indicatorBarWidth.set($indicatorBarWidth === 18 ? 100 : 18)}>Bounce</button>
        </td>
        <td>Width ({width})</td>
        <td><input type="range" min="0" max="2000" bind:value={width}/></td>
    </tr>
</table>


<style>
    .flow {
        opacity: 0.4;
    }

    .out-flow {
        /*fill: #baf4f6;*/
        stroke: #aaa;
        /*fill: #fdde97;*/
        /*stroke: #f6c50b;*/
    }

    .in-flow {
        /*fill: #baf4f6;*/
        stroke: #aaa;
    }

    .history {
        list-style: none;
    }

</style>
