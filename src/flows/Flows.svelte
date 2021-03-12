<script>
    import _ from "lodash";

    import {mkDataSet} from "./data";
    import {selectedFacet} from "./stores/options";

    let data = mkDataSet();

    let el;

    let width = 1000;
    let height = 1000;


    $: {
        const nodesById = _.keyBy(
            _.concat(data.sources, data.targets, [data.app]),
            d => d.id);

        console.log({nodesById})
        const xs = _
            .chain([])
            .concat(data.inbound, data.outbound)
            .tap(t => console.log(t))
            .flatMap(d => _.find(d.facets, {id: $selectedFacet }))
            .map()
            .value();
        console.log(xs);

    }

    let sh = 100;
    let th = 50;
    let sy = 0;
    let ty = 100;
    let tx = 400;

    const offset = 360

    let start, end, mid;

    $: {
        start = {x: 0, y:sy, h: sh};
        end = {x: tx, y:ty, h: th};
        mid = start.x + (end.x - start.x) / 2

    }

    $: console.log(data)

</script>
<h1>Flows</h1>

<svg viewBox="0 0 {width} {height}"
     width="500px"
     bind:this={el}
     style="border: 1px solid red">
    <path d="M 80 60 C 160 60, 160 200, 240 200
             l 0 40
             C 160 240, 160 190, 80 190
             Z"
          fill="pink"
          stroke="red"
          stroke-width="2" />

    <g transform="translate(20 300)">
        <path d="M {start.x} {start.y} C {mid} {start.y}, {mid} {end.y}, {end.x} {end.y}
             l 0 {end.h}
             C {mid} {end.y + end.h}, {mid} {start.y + start.h}, {start.x} {start.y + start.h}
             Z"
              fill="pink"
              stroke="red"
              stroke-width="2" />

    </g>
</svg>

<h3>Controls</h3>
<label>
    Source H
    <input type="range" max="400" bind:value={sh}>
</label>
<label>
    Source Y
    <input type="range" max="400" bind:value={sy}>
</label>
<label>
    Target H
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