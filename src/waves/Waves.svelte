<script>

    import * as d3 from "d3";
    import _ from "lodash";

    let elem = null;

    $: console.log({elem})

    const color = d3
        .scaleLinear()
        .domain([0, 10])
        .range(['#888', '#fafafa']);

    const curveFn = d3
        .line(d => d.x, d => d.y)
        .curve(d3.curveBundle.beta(0.9))


    function mkData(pts=8, height = 100, offset = 25, variation = 100) {
        return [{x: 0, y: 0}]
            .concat(
                _.chain(_.range(0, pts + 1))
                    .map(i => ({
                        y: i * (height / pts),
                        x: Math.random() * variation + offset
                    }))
                    .value())
            .concat([{y: height, x: 0}]);
    }



    let numWaves = 3;
    let h = 200;
    let w = 35;
    $: paths = randomize(numWaves);


    function randomize(waves) {
        return _
            .chain(_.range(0, waves))
            .map(idx => curveFn(mkData(
                idx % 2 ? 8 : 10,
                200,
                45 -idx,
                Math.random() * 24 + 4)))
            .value();
    }

</script>

<svg width="250"
     height="500"
     bind:this={elem}
     style="outline: 1px solid green"
     viewBox="0 0 100 200">

    <g transform="translate(20, 0)">
        <rect width="30"
              y="10"
              height="180"
              stroke="purple"
              fill="none"/>

        {#each paths as p}
            <path d={p}
                  opacity={1 / (numWaves)}
                  stroke-width="0.4"
                  stroke="#669eef"
                  fill="#95d9ef"/>
        {/each}
    </g>

</svg>

<br>
<input type="range"
       min="0"
       max="30"
       bind:value={numWaves}>
<button on:click={() => randomize()}>
    Randomize
</button>