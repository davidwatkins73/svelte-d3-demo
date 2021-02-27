<script>
    import * as d3 from "d3";
    import _ from "lodash";

    import {groupByUser, loadData} from "./utils";

    import Defs from "./Defs.svelte";
    import DeadList from "./DeadList.svelte";
    import UserChart from "./UserChart.svelte";

    const width = 400;
    const height = 300;
    const margin = {
        left: 30,
        right: 20,
        top: 20,
        bottom: 20
    };

    let killList = [];
    let el;  // bound to svg elem
    let data;

    let dataPromise = loadData().then(d => data = d);

    $: byUser = groupByUser(data, killList);

    $: color = d3
        .scaleOrdinal()
        .range(d3.schemeSpectral[10])
        .domain(_.keys(byUser));

    $: yScale = d3
        .scaleBand()
        .domain(_.keys(byUser))
        .range([0, height - (margin.top + margin.bottom)])
        .padding(0.3);

    $: console.log({data, byUser})
</script>

<svg bind:this={el}
     viewBox="0 0 {width} {height}">
    <Defs colors={color}/>
    <g class="chart"
       transform="translate({margin.left} {margin.top})">
        {#each _.keys(byUser) as user}
            <g transform="translate(0 {yScale(user)})">
                <UserChart {user}
                           data="byUser[user]"
                           height={yScale.bandwidth()}
                           width={width - (margin.left + margin.right)}
                           on:remove={() => killList= [...killList, user]}/>
            </g>
        {/each}
    </g>
</svg>

<hr>

<div style="height: 60px">
    <DeadList list={killList}
              on:restore={u => killList = _.without(killList, u.detail)}/>
</div>

<style>
</style>