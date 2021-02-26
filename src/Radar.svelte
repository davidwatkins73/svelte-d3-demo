<script>
import * as d3 from "d3";

const width = 400, height = 300;
const margin = {
    left: 20,
    right: 20,
    top: 20,
    bottom: 20
};

const color = d3
    .scaleOrdinal()
    .domain(['r', 'a', 'g'])
    .range(["#fd4d4d", "#eeb65f", "#a8e761"]);


let el;  // bound to svg elem

// --------------

$: svg = d3
    .select(el)
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

$: {
    svg.append("g")
        .classed("chart", true);
}


$: {
    svg.select("g.chart")
}

</script>

<svg bind:this={el}/>

<style>
</style>