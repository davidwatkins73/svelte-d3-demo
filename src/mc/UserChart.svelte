<script>
    import * as d3 from "d3";

    import {evtToSVGCoords} from "./utils";
    import RemoveLaneButton from "./RemoveLaneButton.svelte";
    import {selectedDate} from "./stores/date-selection-store";
    import {showWorkDayGuideLines} from "./stores/overlays-store";
    import {killList} from "./stores/filters-store";

    export let user;
    export let data = [];

    export let height;
    export let dateScale;

    $: hourScale = d3
        .scaleLinear()
        .domain([5, 23])
        .range([3, height - 3])
        .clamp(true)

    let el;

    $: {
        const contribs = d3
            .select(el)
            .selectAll(".contrib")
            .data(data, d => d.hash)

        const newContribs = contribs
            .enter()
            .append("circle")
            .attr("cx", d => dateScale(d.date))
            .attr("cy", d => hourScale(d.date.getHours()))
            .classed("contrib", true)
            .on("mouseover", (e, d) => console.log(d))

        newContribs
            .merge(contribs)
            .transition(d3.transition(300))
            .attr("cx", d => dateScale(d.date))
            .attr("cy", d => hourScale(d.date.getHours()))
            .attr("r", 2)
            .style("fill", d => d.isMerge ? "#9fea92" : "#f38237")
            .style("opacity", 0.3);

        contribs.exit().remove();
    }


    function onClick(evt) {
        const coords = evtToSVGCoords(evt, el);
        selectedDate.set(dateScale.invert(coords.x));
    }


    function onRemove() {
        console.log("Remove", user)
        killList.update(xs => [...xs, user]);
    }


</script>


<rect x="0"
      on:click={(e) => onClick(e)}
      style="opacity: 0.2"
      {height}
      width={dateScale.range()[1]}
      fill="url('#gradient-{user}')">
</rect>

{#if $showWorkDayGuideLines}
    <line class="workday-line start"
          x1="0"
          x2={dateScale.range()[1]}
          y1={hourScale(8.5)}
          y2={hourScale(8.5)}>
    </line>
    <line class="workday-line end"
          x1="0"
          x2={dateScale.range()[1]}
          y1={hourScale(17.5)}
          y2={hourScale(17.5)}>
    </line>
{/if}

<g class="chart"
   bind:this={el}>
</g>

<text dy={height / 2 + 2}
      dx="2"
      class="label">
    {user}
</text>

<g transform="translate( -20)">
    <RemoveLaneButton {height} on:remove={onRemove}/>
</g>


<style>
    .label {
        fill: #671d27;
        font-size: 10px
    }

    .workday-line {
        stroke-width: 0.4;
        stroke: #ddcef6;
        stroke-dasharray: 2 1;
    }
</style>