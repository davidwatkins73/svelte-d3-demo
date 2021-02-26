<script>
import * as d3 from "d3";

const margin = {
    left: 40,
    right: 40,
    top: 40,
    bottom: 10
};

const width = 400, height = 300;

let data = [10, 4, 50, 30, 20];

$: nodeScale = d3
    .scaleLinear()
    .domain(d3.extent(data));

$: colorScale = d3
    .scaleLinear()
    .domain(d3.extent(data));

$: xScale = d3
    .scaleLinear()
    .domain([0, data.length - 1]);

$: yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data)]);

let el;

$: {
    nodeScale.range([10, 30]);
    xScale.range([0, width]);
    yScale.range([height, 0]);
    colorScale.range(["#f8ccd0", "#ff0b0b"])

    const circles = svg.selectAll("circle")
        .data(data);

    const newCircles = circles
        .enter()
        .append("circle")
        .style("fill", "#fff1f7")
        .attr("cx", width / 2)
        .attr("cy", height / 2)

    circles
        .merge(newCircles)
        .transition(d3.transition().duration(400))
        .attr("r", nodeScale)
        .attr("cx", (d, i) => xScale(i))
        .attr("cy", d => yScale(d))
        .style("fill", colorScale)
        .style("stroke", "#8d2020")

    circles
        .exit()
        .remove();
}

$: svg = d3
    .select(el)
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left} ${margin.top})`)

</script>

<svg bind:this={el}/>

<br>

<button on:click={() => data = [...data, Math.random() * 1000]}>Mwoar</button>
<style>

</style>