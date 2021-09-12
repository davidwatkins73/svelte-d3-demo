<script>
    function mkPath(x1, y1, x2, y2, c = 0.2) {
        const dx = x2 - x1;
        const dy = y2 - y1;

        const horizRatio = (1 - c) / 2;
        const x1a = x1 + dx * horizRatio;
        const x2a = x2 - dx * horizRatio;

        const cmds = [
            `M${x1} ${y1}`,  // start pos
            `L${x1a} ${y1}`,
            `C${x2a} ${y1}, ${x1a} ${y2}, ${x2a} ${y2}`,
            `L${x2} ${y2}`// end pos
        ];

        return cmds.join(" ");
    }

    let c = 0.3;

    let x1 = 10;
    let y1 = 190;
    let x2 = 200;
    let y2 = 20;
</script>


<input bind:value={c}
       type="range"
       min="0.05"
       max="0.5"
       step="0.05">

<pre>c = {c}</pre>

<svg viewbox="0 0 300 300">
    <line {x1} {y1} {x2} {y2}></line>
    <path d={mkPath(x1, y1, x2, y2, c)}></path>
    <path d={mkPath(130, 120, 300, 85, c)}></path>

</svg>

<style>
    line {
        stroke: green;
        stroke-width: 1;
    }
    path {
        stroke: red;
        fill: none;
        stroke-width: 2;
    }
</style>