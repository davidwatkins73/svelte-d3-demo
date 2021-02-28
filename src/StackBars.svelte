<script>
import * as d3 from "d3";

const width = 400, height = 300;
const margin = {
    left: 20,
    right: 20,
    top: 20,
    bottom: 20
};

const keyNames = {
    r: "Sell",
    a: "Hold",
    g: "Buy"
};


function arr(count) {
    const xs = [];
    for (let i = 0; i < count; i ++) xs[i] = i;
    return xs;
}

let data = [];
let el;

let idx = 8;

function mwoar(start, end) {
    idx += Math.random() * 10 + 1;
    const datum = {
        s: start,
        e: end,
        v: {
            r: arr(Math.random() * 10 + 3),
            a: arr(Math.random() * 15 + 4),
            g: arr(Math.random() * 12 + 2)
        }
    };

    data = [...data, datum];
}


const color = d3
    .scaleOrdinal()
    .domain(['r', 'a', 'g'])
    .range(["#fd4d4d", "#eeb65f", "#a8e761"]);


const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3
        .axisBottom(x)
        .ticks(width / 80)
        .tickSizeOuter(0));



const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));



mwoar(0, 10);
mwoar(10, 12);
mwoar(12,17);
mwoar(17,21);
mwoar(21,25);
mwoar(25,26);
mwoar(26,45);
mwoar(45,49);

// --------------

let blurDeviation = 1.5;
let useBlur = true;
let showAxes = true;

$: d3.selectAll("g.axis")
    .call(g => g
        .selectAll(".domain")
        .style("display", "none"))
    .call(g => g
        .selectAll(".tick line")
        .style("display", showAxes ? "" : "none"));


$: svg = d3
    .select(el)
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

$: {
    //Container for the gradients
    const defs = svg.append("defs");

//Filter for the outside glow
    const filter = defs.append("filter")
        .attr("id","glow");
    filter
        .append("feGaussianBlur")
        .attr("result","coloredBlur");
    const feMerge = filter
        .append("feMerge");
    feMerge
        .append("feMergeNode")
        .attr("in","coloredBlur");
    feMerge
        .append("feMergeNode")
        .attr("in","SourceGraphic");

    svg.append("g")
        .classed("chart", true);
    svg.append("g")
        .classed("axis", true)
        .classed("x-axis", true);
    svg.append("g")
        .classed("axis", true)
        .classed("y-axis", true);
}

$: series = d3
    .stack()
    .keys(['r', 'a', 'g'])
    .value((d, k) => d.v[k].length)(data);

$: y  = d3
    .scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
    .range([height - margin.bottom, margin.top]);

$: x = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.e)])
    .range([margin.left, width - margin.right]);

$: {
    svg.select("g.chart")
        .selectAll("g")
        .data(series)
        .enter()
        .append("g")
        .style("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", (d, i) => x(d.data.s))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", d => x(d.data.e) - x(d.data.s))
        .style("stroke", "white")
        .style("stroke-width", 0.3)
        .append("title")
        .text(({key}) => keyNames[key]);

    svg.select("g.x-axis")
        .call(xAxis);

    svg.select("g.y-axis")
        .call(yAxis);
}

$: svg.select('#glow feGaussianBlur').attr("stdDeviation", blurDeviation);

$: svg.selectAll("rect").attr("filter", useBlur ? "url(#glow)" : "none")

</script>

<svg bind:this={el}/>

<label>
    Blur deviation ({blurDeviation || "-"})
</label>
<input type="range" min="0.1" max="10" step="0.1" bind:value={blurDeviation}/>

<label>
    Use blur
    <input type="checkbox" bind:checked={useBlur}/>
</label>


<label>
    Show Axes
    <input type="checkbox" bind:checked={showAxes}/>
</label>

<style>
</style>