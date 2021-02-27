<script>
    import * as d3 from "d3";
    import _ from "lodash";

    import Defs from "./Defs.svelte";
    import {sanitize} from "./utils";
    import RemoveLaneButton from "./RemoveLaneButton.svelte";
    import DeadList from "./DeadList.svelte";

    const HEADER = "hash\tcommitter\ttime\tcomment\n";

    const width = 400, height = 300;
    const margin = {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20
    };

    let killList = [];
    let el;  // bound to svg elem
    let data;

    let dataPromise = d3
        .text("./mc/data.tsv")
        .then(d => d3.tsvParse(HEADER + d))
        .then(d => data = sanitize(d))

    $: byUser = _.chain(data)
        .groupBy("committer")
        .omit(killList)
        .value();

    $: color = d3.scaleOrdinal()
        .range(d3.schemeSpectral[10])
        .domain(_.keys(byUser));

    $: yScale = d3.scaleBand()
        .domain(_.keys(byUser))
        .range([0, height - (margin.top + margin.bottom)])
        .padding(0.2);
    const cross = d3.symbol(d3.symbolCross, 80)();

    $: console.log({data, byUser, cross})

</script>

<svg bind:this={el}
     viewBox="0 0 {width} {height}">
    <Defs colors={color}/>
    <g class="chart"
       transform="translate({margin.left} {margin.top})">
        {#each _.keys(byUser) as user}
            <g transform="translate(0 {yScale(user)})">
                <rect x="0"
                      height={yScale.bandwidth()}
                      width={width - (margin.left + margin.right)}
                      fill="url('#gradient-{user}')"/>
                <g transform="translate( -10 {yScale.bandwidth()/2})">
                    <RemoveLaneButton on:remove={() => killList= [...killList, user]}/>
                </g>
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