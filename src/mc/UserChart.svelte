<script>
    import RemoveLaneButton from "./RemoveLaneButton.svelte";
    import * as d3 from "d3";
    import {evtToSVGCoords} from "./utils";
    import {selectedDate} from "./stores/date-selection-store";

    export let user;
    export let data = [];

    export let height;
    export let dateScale;

    $: hourScale = d3
        .scaleLinear()
        .domain([6, 20])
        .range([3, height - 3])
        .clamp(true)

    let el;

    $: {
        const contribs = d3
            .select(el)
            .selectAll(".contrib")
            .data(data, d => d.hash);

        const newContribs = contribs
            .enter()
            .append("circle")
            .attr("cx", d => dateScale(d.date))
            .attr("cy", d => hourScale(d.date.getHours()))
            .classed("contrib", true);

        newContribs
            .merge(contribs)
            .transition(d3.transition(300))
            .attr("cx", d => dateScale(d.date))
            .attr("cy", d => hourScale(d.date.getHours()))
            .attr("r", 2)
            .style("fill", "#f38237")
            .style("opacity", 0.3);

        contribs.exit().remove();
    }


    function onClick(evt) {
        const coords = evtToSVGCoords(evt, el);
        selectedDate.set(dateScale.invert(coords.x));
    }

</script>


<rect x="0"
      on:click={(e) => onClick(e)}
      style="opacity: 0.2"
      {height}
      width={dateScale.range()[1]}
      fill="url('#gradient-{user}')">
</rect>

<g class="chart"
   bind:this={el}>
</g>

<text dy="-2"
      style="font-size: small">
    {user}
</text>

<g transform="translate( -20)">
    <RemoveLaneButton {height}
                      on:remove/>
</g>


<style>
</style>