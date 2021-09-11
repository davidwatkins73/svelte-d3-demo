<script>
    function mkPath(x1, y1, x2, y2, c = 0.2) {

        const vertRatio = 1 - c;
        const horizRatio = (1 - c) / 2;
        const curveRatio = c / 2;

        const dx = x2 - x1;
        const dy = y2 - y1;

        const cmds = [
            `m${x1} ${y1}`,  // start pos
            `l${dx * horizRatio} 0`,  // top horiz
            `q${dx * curveRatio} 0, ${dx * curveRatio} ${dy * curveRatio}`, // top curve
            `l0 ${dy * vertRatio}`,  // main vert
            `q0 ${dy * curveRatio}, ${dx * curveRatio} ${dy * curveRatio}`, // bottom curve
            `l${dx * horizRatio} 0`  // bottom horiz
        ];

        return cmds.join(" ");
    }

    let c = 0.3;

</script>

<input bind:value={c}
       type="range"
       min="0.05"
       max="0.5"
       step="0.05">

<pre>c = {c}</pre>

<svg viewbox="0 0 300 300">
    <path d={mkPath(200, 100, 100, 205, c)}></path>

</svg>

<style>
    path {
        stroke: red;
        fill: none;
        stroke-width: 2;
    }
</style>