<script>
    import {mkPathData} from "./arcs";
    import * as d3 from "d3";

    let width = 1000;
    let height = 1000;

    let sh = 80;
    let th = 40;
    let sy = 0;
    let ty = 200;
    let tx = 960;
    let tension = 0.1;

    let pathData;

    $: paths = Array
        .from({length: 10})
        .map((x, idx) => mkPathData(
            sy + (idx * (sh + 10)),
            sh,
            ty + (idx * (th + 10)) ,
            th,
            tx,
            tension));

    const color = d3
        .scaleLinear()
        .domain([0, 10])
        .range(['#888', '#fafafa']);
</script>


<svg viewBox="0 0 {width} {height}"
     width="80%"
     style="border: 1px solid red">
    <g transform="translate(20 20)">
        {#each paths as pathData, idx}
            <path d={pathData}
                  fill="{color(idx)}"/>
        {/each}
    </g>
</svg>

<h3>Controls</h3>

<label>
    Source Height
    <input type="range" max="400" bind:value={sh}>
</label>
<label>
    Source Y
    <input type="range" max="400" bind:value={sy}>
</label>
<label>
    Target Height
    <input type="range" max="400" bind:value={th}>
</label>
<label>
    Target Y
    <input type="range" max="400" bind:value={ty}>
</label>
<label>
    Width
    <input type="range" max="1000" bind:value={tx}>
</label>
<label>
    Tension
    <input type="range" max="1" step="0.05" bind:value={tension}>
</label>
