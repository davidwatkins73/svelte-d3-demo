<script>
    import {filteredClients, clientScale, clientScrollOffset} from "./fancy-store";
    import {dimensions} from "./fancy-utils"
</script>

<g transform={`translate(0, ${$clientScrollOffset})`}>
{#each $filteredClients as client}
    <g transform={`translate(0, ${$clientScale(client.id)})`}>
        <rect fill="#eee"
              stroke="#999"
              rx={dimensions.client.height / 2}
              width={dimensions.client.width}
              height={dimensions.client.height}/>
        <text dx="10"
              dy={dimensions.client.height / 2 + 8}>
            {client.name}
        </text>
    </g>
{/each}
</g>
