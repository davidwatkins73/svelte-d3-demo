<script>
    import * as d3 from "d3";

    const width = 400, height = 300;
    const margin = {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20
    };

    let data = [];

    let r = 100;

    let segments = 6;

    function mkSpiral(segCount, radius) {
        const arcs = segCount * 2 + 1;
        return Array.from(
            { length: arcs },
            (_, i) => [
                (Math.PI / (segments / 2)) * i, // angle (in radians)
                radius
            ]);
    }


    let el;  // bound to svg elem

    // --------------

    $: svg = d3
        .select(el)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left} ${margin.top})`);

    $: chart = svg.append("g")
        .classed("chart", true)
        .attr("transform", `translate(${width/2} ${height/2})`);

    $: working = chart
        .selectAll(".working")
        .data([1], d => d)
        .enter()
        .append("path")
        .classed("working", true);

    $: {
        const history = chart
            .selectAll(".history")
            .data(data, d => `${d.segCount}_${d.r}`);

        history
            .enter()
            .append("path")
            .classed("history", true)
            .attr("d", d => d3.lineRadial()(mkSpiral(d.segCount, d.r)))
            .attr("fill", "none")
            .attr("stroke", "red");

        history.exit().remove();
    }

     $: {
        working
            .attr("d", d => d3.lineRadial()(mkSpiral(segments, r)))
            .attr("fill", "none")
            .attr("stroke", "black");
    }


    $: {
        svg.select("g.chart")
    }

    function push() {
        data = [...data, {segCount: segments, r}];
        r -= 15;
    }

    function reset() {
        data = [];
        segments = 6;
        r = 100;
    }

</script>

<svg bind:this={el}/>

<input type="range" min="3" max="20" bind:value={segments} placeholder="segments">
<button on:click={() => push()}>Push</button>
<button on:click={() => reset()}>Reset</button>

<style>
</style>