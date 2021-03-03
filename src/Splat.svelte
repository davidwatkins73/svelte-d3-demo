<script>
    import * as d3 from "d3";

    let el;

    let data = [];

    $: x = d3
        .scaleLinear()
        .domain([2, 12])
        .range([100, 500]);

    $: y = d3
        .scaleLinear()
        .domain([2, 12])
        .range([50, 350]);

    $: r = d3
        .scaleLinear()
        .domain([2, 12])
        .range([20, 50]);

    $: c = d3
        .scaleLinear()
        .domain([0, 30])
        .range(["#51b333", "#e7efe0"])
        .clamp(true);

    $: {
        const splats = d3
            .select(el)
            .selectAll(".splat")
            .data(data);

        const newSplats = splats
            .enter()
            .append("circle")
            .classed("splat", true)
            .style("filter", "url(#displacementFilter)");

        splats
            .merge(newSplats)
            .attr("cx", (d, i) => x(d.x))
            .attr("cy", (d, i) => y(d.y))
            .attr("r", d => r(d.r))
            .style("fill", (d, i) => c(data.length - i));
    }

    function mwoar() {
        data = [...data, {
            x: Math.random() * 10 + 2,
            y: Math.random() * 10 + 2,
            r: Math.random() * 10 + 2
        }];
    }

    mwoar(); mwoar(); mwoar();
</script>

<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
        <filter id="displacementFilter">
            <feTurbulence type="turbulence" baseFrequency="0.05"
                          numOctaves="2" result="turbulence"/>
            <feDisplacementMap in2="turbulence" in="SourceGraphic"
                               scale="20" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
    <g bind:this={el}/>
</svg>

<br>

<button on:click={() => mwoar()}>Mwoar</button>