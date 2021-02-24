<script>
import * as d3 from "d3";

const margin = {
    left: 40,
    right: 40,
    top: 40,
    bottom: 10
};

const width = 400, height = 300;

const keyNames = {
    r: "Sell",
    a: "Hold",
    g: "Buy"
};

let data = [
    { k:1, v: {r: 1, a: 3, g: 4 }},
    { k:2, v: {r: 2, a: 6, g: 2 }},
    { k:3, v: {r: 4, a: 4, g: 7 }},
    { k:5, v: {r: 3, a: 4, g: 7 }},
    { k:7, v: {r: 2, a: 8, g: 3 }}
];

let el;
let idx = 8;

function mwoar() {
    idx += Math.random() * 10 + 1;
    const datum = {
        k: idx,
        v: {
            r: Math.random() * 5 + 3,
            a: Math.random() * 5 + 4,
            g: Math.random() * 5 + 2
        }
    };

    data = [...data, datum];
}

const color = d3
    .scaleOrdinal()
    .domain(['r', 'a', 'g'])
    .range(["red", "orange", "green"]);

const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3
        .axisBottom(x)
        .ticks(width / 80)
        .tickSizeOuter(0));

const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove());

const area = d3
    .area()
    .x(d => x(d.data.k))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]))

$: svg = d3
    .select(el)
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

$: {
    svg.append("g")
        .classed("chart", true);
    svg.append("g")
        .classed("x-axis", true);
    svg.append("g")
        .classed("y-axis", true);
}

$: series = d3
    .stack()
    .keys(['r', 'a', 'g'])
    .value((d, k) => d.v[k])(data);

$: y  = d3
    .scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
    .range([height - margin.bottom, margin.top]);

$: x = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.k))
    .range([margin.left, width - margin.right]);

$: {
    svg.select("g.chart")
        .selectAll("path")
        .data(series)
        .join("path")
        .attr("fill", ({key}) => color(key))
        .attr("d", area)
        .append("title")
        .text(({key}) => keyNames[key]);

    svg.select("g.x-axis")
        .call(xAxis);

    svg.select("g.y-axis")
        .call(yAxis);
}

$: console.log({series});
</script>

<svg bind:this={el}/>
<button on:click={mwoar}>Mwoar!</button>
<style>
    svg {
        border: 1px solid red;
    }
</style>