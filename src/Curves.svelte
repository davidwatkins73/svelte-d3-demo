<script>
    let sx = 80;
    let sy = 60;
    let c1x = 200;
    let c1y = 70;
    let c2x = 150;
    let c2y = 190;
    let ex = 240;
    let ey = 240;
    let sw = 20;
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
            r="4"/>

    <circle cx={sx}
            cy={sy}
            fill="purple"
            r="4"/>

    <line x1={sx}
          x2={c1x}
          y1={sy}
          y2={c1y}
          class="guide"
          stroke="red"/>

    <line x1={ex}
          x2={c2x}
          y1={ey}
          y2={c2y}
          class="guide"
          stroke="green"/>

    <line x1={sx}
          x2={ex}
          y1={sy}
          y2={ey}
          stroke-width="2"
          stroke-dasharray="1 3"
          stroke="#ccc"/>

    <text dy="380"
          style="font-family: monospace">
        <tspan>
            &lt;path d="S
        </tspan>
        <tspan fill="purple">
            {sx + ' ' + sy}
        </tspan>
        <tspan>
            C
        </tspan>
        <tspan fill="red">
            {c1x + ' ' + c1y}
        </tspan>
        <tspan>
            ,
        </tspan>
        <tspan fill="green">
            {c2x + ' ' + c2y}
        </tspan>
        <tspan>
            ,
        </tspan>
        <tspan fill="blue">
            {ex + " " + ey + '"'}
        </tspan>
        <tspan>
            stroke-width="{sw}"
        </tspan>
        <tspan>
            /&gt;
        </tspan>
    </text>

    <g class="point-labels">
        <text dx={c1x + 5}
              dy={c1y + 4}>
            C1
        </text>

        <text dx={sx + 5}
              dy={sy + 4}>
            S
        </text>

        <text dx={ex + 5}
              dy={ey + 4}>
            E
        </text>

        <text dx={c2x + 5}
              dy={c2y + 4}>
            C2
        </text>
    </g>
</svg>

<table>
    <colgroup>
        <col width="20%">
        <col width="20%">
        <col width="30%">
        <col width="30%">
    </colgroup>
    <thead>
    <tr>
        <th>Name</th>
        <th>Value</th>
        <th>X</th>
        <th>Y</th>
    </tr>
    </thead>
    <tr style="color:purple">
        <td>Start</td>
        <td>{sx} {sy}</td>
        <td><input type="range" min="0" max="500" bind:value={sx}/></td>
        <td><input type="range" min="0" max="500" bind:value={sy}/></td>
    </tr>
    <tr style="color:red">
        <td>C1</td>
        <td>{c1x} {c1y}</td>
        <td><input type="range" min="0" max="500" bind:value={c1x}/></td>
        <td><input type="range" min="0" max="500" bind:value={c1y}/></td>
    </tr>
    <tr style="color:green">
        <td>C2</td>
        <td>{c2x} {c2y}</td>
        <td><input type="range" min="0" max="500" bind:value={c2x}/></td>
        <td><input type="range" min="0" max="500" bind:value={c2y}/></td>
    </tr>
    <tr style="color:blue">
        <td>End</td>
        <td>{ex} {ey}</td>
        <td><input type="range" min="0" max="500" bind:value={ex}/></td>
        <td><input type="range" min="0" max="500" bind:value={ey}/></td>
    </tr>
    <tr>
        <td>Width</td>
        <td>{sw}</td>
        <td colspan="2">
            <input type="range" min="1" max="100" bind:value={sw}/>
        </td>
        <td></td>
    </tr>
</table>

<style>
    table td {
        text-align: center;
    }
    .point-labels text {
        font-family: monospace;
    }

    .guide {
        stroke-width: 1;
        stroke-dasharray: 1 3;
    }

</style>