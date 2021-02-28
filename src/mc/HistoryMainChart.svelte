<script>
    import * as d3 from "d3";
    import _ from "lodash";

    import Defs from "./Defs.svelte";
    import UserChart from "./UserChart.svelte";
    import DetailPanel from "./DetailPanel.svelte";

    import {killList, showMerges} from "./stores/filters-store";
    import {groupByUser, loadData, mkDateScale} from "./utils";


    const width = 400;
    const height = 350;
    const margin = {
        left: 30,
        right: 20,
        top: 20,
        bottom: 20
    };

    let el;  // bound to svg elem
    let data;

    loadData().then(d => data = d);

    $: rowData = groupByUser(
        _.filter(data, d => $showMerges
            ? true
            : !d.isMerge),
        $killList);

    $: color = d3
        .scaleOrdinal()
        .range(d3.schemeSpectral[6])
        .domain(_.map(rowData, d => d.committer));

    $: yScale = d3
        .scaleBand()
        .domain(_.map(rowData, d => d.committer))
        .range([0, height - (margin.top + margin.bottom)])
        .padding(0.15);

    $: dateScale = mkDateScale(data)
        .range([4, width - (margin.left + margin.right) - 4]);

    $: console.log({rowData, data})
</script>



<div class="column left">
    <svg bind:this={el}
         viewBox="0 0 {width} {height}">

        <Defs colors={color}/>
        <g class="chart"
           transform="translate({margin.left} {margin.top})">
            {#each rowData as {committer, values}}
                <g class="user-chart"
                   transform="translate(0 {yScale(committer)})">
                    <UserChart user={committer}
                               data={values}
                               height={yScale.bandwidth()}
                               {dateScale}/>
                </g>
            {/each}
        </g>
    </svg>
</div>

<div class="column right">
    <DetailPanel/>
</div>

<style>
    .column {
        float: left;
    }

    .left {
        width: 70%;
    }

    .right {
        width: 30%;
        text-align: left;
    }

    .user-chart {
        will-change: transform;
        transition: transform 0.3s;
    }

</style>