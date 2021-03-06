<script>
    let sx = 80;
    let sy = 60;
    let c1x = 200;
    let c1y = 70;
    let c2x = 150;
    let c2y = 160;
    let ex = 240;
    let ey = 240;
    let sw = 20;

    $: pathPreview =`<path d='S ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ey} ${ey}'/>`;
</script>

<svg height="400"
     width="500">

    <path d="M {sx} {sy} C {c1x} {c1y}, {c2x} {c2y}, {ex} {ey}"
          stroke="#c33"
          stroke-width={sw}
          style="opacity: 0.6"
          fill="transparent"/>

    <circle cx={c1x}
            cy={c1y}
            fill="red"
            r="3"/>

    <circle cx={c2x}
            cy={c2y}
            fill="green"
            r="3"/>

    <circle cx={ex}
            cy={ey}
            fill="blue"
            r="3"/>

    <circle cx={sx}
            cy={sy}
            fill="pink"
            r="3"/>

    <line x1={c1x}
          x2={c2x}
          y1={c1y}
          y2={c2y}
          stroke-width="2"
          stroke="#999"/>

    <text dy="380"
          dx="100"
          style="font-family: monospace">
        {pathPreview}
    </text>
</svg>

<div>
    <b style="color: pink">Start</b>
    <input type="range" min="0" max="500" bind:value={sx}/>
    <input type="range" min="0" max="400" bind:value={sy}/>
</div>
<div>
    <b style="color: red">C1</b>
    <input type="range" min="0" max="500" bind:value={c1x}/>
    <input type="range" min="0" max="400" bind:value={c1y}/>
</div>
<div>
    <b style="color: green">C2</b>
    <input type="range" min="0" max="500" bind:value={c2x}/>
    <input type="range" min="0" max="400" bind:value={c2y}/>
</div>
<div>
    <b style="color: blue">End</b>
    <input type="range" min="0" max="500" bind:value={ex}/>
    <input type="range" min="0" max="400" bind:value={ey}/>
</div>
<div>
    <b>Width</b>
    <input type="range" min="1" max="100" bind:value={sw}/>
</div>
