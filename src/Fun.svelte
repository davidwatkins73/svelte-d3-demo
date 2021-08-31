<script>
    import * as d3 from "d3";


    function xmur3(str) {
        for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
            h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
                h = h << 13 | h >>> 19;
        return function() {
            h = Math.imul(h ^ h >>> 16, 2246822507);
            h = Math.imul(h ^ h >>> 13, 3266489909);
            return (h ^= h >>> 16) >>> 0;
        }
    }

    function nextFloat(rnd) {
        return rnd() / 0xFFFFFFFF;
    }

    const w = 1000;
    const h = 1000;

    let el;
    let seed = Date().toString();

    $: svg = d3.select(el);

    $: {
        const rnd = xmur3(seed);
        const pointData = Array
            .from({length: Math.ceil(nextFloat(rnd) * 4) + 1})
            .map(idx => ({
                r: nextFloat(rnd) * 20  + 5,
                h: nextFloat(rnd) * 360,
                s: nextFloat(rnd) * 10 + 25,
                l: nextFloat(rnd) * 10 + 90,
                d: nextFloat(rnd) * 50 + 20
            }))

        const perimeterData = Array
            .from({length: Math.ceil(nextFloat(rnd) * 2) + 1})
            .map(() => ({
                r: nextFloat(rnd) * (w / 6)  +  w / 6,
            }))

        const points = svg
            .selectAll(".point")
            .data(pointData);

        const perimeterColor = d3
            .scaleLinear()
            .domain([0, perimeterData.length])
            .range(["#999", "#eee"])

        const newPoints = points
            .enter()
            .append("circle")
            .classed("point", true)
            .attr("cx", w / 2)
            .attr("cy", (d, idx) => h / 2 + (50 * idx) + d.d)
            .attr("opacity", 0.5)
            .attr("filter", "url(#displacementFilter2");

        newPoints
            .merge(points)
            .transition()
            .duration(100)
            .attr("r", d => d.r)
            .attr("cx", w / 2)
            .attr("cy", (d, idx) => h / 2 + (50 * idx) + d.d)
            .attr("fill", d => d3.hcl(d.h, d.s, d.l))

        points
            .exit()
            .transition()
            .duration(100)
            .attr("r", 0)
            .remove();

        const perimeters = svg
            .selectAll(".perimeter")
            .data(perimeterData);

        const newPerimeters = perimeters
            .enter()
            .append("circle")
            .classed("perimeter", true)
            .attr("cx", w /2)
            .attr("cy", h / 2)
            .attr("stroke", (d, idx) => perimeterColor(idx))
            .attr("fill", "none")
            .attr("filter", "url(#displacementFilter")

        newPerimeters
            .merge(perimeters)
            .transition()
            .duration(100)
            .attr("r", d => d.r);

        newPerimeters
            .exit()
            .remove();
    }
</script>


<svg bind:this={el} viewBox="0 0 {w} {h}" width="80%" style="border: 1px solid pink;">
    <filter id="displacementFilter">
        <feTurbulence type="turbulence" baseFrequency="0.05"
                      numOctaves="2" result="turbulence"/>
        <feDisplacementMap in2="turbulence" in="SourceGraphic"
                           scale="20" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="displacementFilter2">
        <feTurbulence type="turbulence" baseFrequency="0.005"
                      numOctaves="2" result="turbulence"/>
        <feDisplacementMap in2="turbulence" in="SourceGraphic"
                           scale="20" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <circle cx={w/2} cy={h/2} r="10" fill="#fafafa"/>
</svg>

<label>
    Seed:
    <input type="text" bind:value={seed}>
</label>


