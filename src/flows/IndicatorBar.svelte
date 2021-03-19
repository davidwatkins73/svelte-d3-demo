<script>
    import * as d3 from "d3";
    import _ from "lodash";

    export let width = 10;
    export let height;
    export let data = {};

    const color = d3
        .scaleOrdinal()
        .domain(["R", "A", "G", "Z"])
        .range(["#e79d9d", "#e7d49a", "#a8e29e", "#aaa"]);

    $: stackData = d3
        .stack()
        .keys(color.domain())
        ([data]);

    $: total = _.sumBy(
        color.domain(),
        k => data[k] || 0);

    $: y = d3
        .scaleLinear()
        .range([0, height])
        .domain([0, total]);
</script>

<g on:click
   on:mouseenter
   on:mouseleave>
    {#each stackData as d}
        <rect y={y(d[0][0])}
              {width}
              height={y(d[0][1] - d[0][0])}
              fill={color(d.key)}/>
    {/each}
</g>
