<script>
    import * as d3 from 'd3';

    const w = 100;
    const h = 8;
    const r = 4;

    const margins = {
        left: 4,
        right: 4,
        top: 2,
        bottom: 2
    };

    export let data;
    export let timeExtent;

    let el;

    $: scale = d3
        .scaleLinear()
        .domain(timeExtent)
        .range([margins.left, w - (margins.left + margins.right)]);

    $: color = d3
        .scaleOrdinal()
        .domain(["g", "a", "r", "x"])
        .range(["green", "orange", "red", "grey"]);

    $: {
        const circles = d3
            .select(el)
            .selectAll("circle")
            .data(data);

        const newCircles = circles
            .enter()
            .append("circle")
            .attr("r", 2)
            .attr("cx", d => scale(d.date))
            .attr("cy", h / 2)
            .style("fill", d => color(d.rating));

        circles
            .merge(newCircles)
            .transition()
            .duration(600)
            .attr("cx", d => scale(d.date))
            .attr("cy", h / 2);
    }
</script>

<svg viewBox="0 0 {w} {h}"
     height="12px">
    <g bind:this={el}>
        <line x1={scale.range()[0] - 3}
              x2={scale.range()[1] + 3}
              y1={h/2}
              y2={h/2}
              stroke="#bbb"/>
    </g>
</svg>