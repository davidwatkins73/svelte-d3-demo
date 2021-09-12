<script>
    function lineToSPath(x1, y1, x2, y2, c = 0.2) {
        const dx = x2 - x1;
        const dy = y2 - y1;

        // curve length, we don't want elongated curves - so pick the smallest
        const cl = Math.min(
            Math.abs(dy * c),
            Math.abs(dx * c));

        // middle
        const xm = x1 + dx / 2;

        // start and ending points of the curves,
        // ..the ternary expr (?:) on the end ensures we are adding/removing as appropriate
        const x1a = xm + cl * (x1 > x2 ? 1 : -1);
        const x2a = xm - cl * (x1 > x2 ? 1 : -1);
        const y1a = y1 + cl * (y1 > y2 ? -1 : 1);
        const y2a = y2 - cl * (y1 > y2 ? -1 : 1);

        // list of svg path commands
        const cmds = [
            `M${x1} ${y1}`,  // start pos
            `L${x1a} ${y1}`, // start horiz
            `Q${xm} ${y1}, ${xm} ${y1a}`, // curve to vert
            `L${xm} ${y2a}`, // vert
            `Q${xm} ${y2}, ${x2a} ${y2}`, // curve to horiz
            `L${x2} ${y2}`, // end horiz
        ];

        // concat to make final command str
        return cmds.join(" ");
    }

    let c = 0.15;

    let x1 = 10;
    let y1 = 190;
    let x2 = 200;
    let y2 = 20;
</script>



<input bind:value={x1} type="range" min="10" max="290">
<input bind:value={x2} type="range" min="10" max="290">
<input bind:value={y1} type="range" min="10" max="290">
<input bind:value={y2} type="range" min="10" max="290">
<pre>Line = ({x1} {y1}, {x2} {y2})</pre>
<hr>
<input bind:value={c}
       type="range"
       min="0.05"
       max="0.5"
       step="0.05">

<pre>Curve = {c}</pre>

<svg viewbox="0 0 300 300">
    <line {x1} {y1} {x2} {y2}></line>
    <path d={lineToSPath(x1, y1, x2, y2, c)}></path>
    <circle r="5" fill="blue" opacity="0.5" cx={x2} cy={y2}></circle>
    <circle r="3" fill="green" opacity="0.5" cx={x1} cy={y1}></circle>
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