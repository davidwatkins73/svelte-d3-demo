<script>
    import {clients, clientScale, clientScrollOffset} from "./fancy-store";

</script>

<g transform={`translate(0, ${$clientScrollOffset})`}>
{#each $clients as client}
    <g transform={`translate(0, ${$clientScale(client.id)})`}>
        <rect fill="#eee"
              stroke="#999"
              width="90"
              height={$clientScale.bandwidth()}/>
        <text dx="10"
              dy="12">
            {client.name}
        </text>
    </g>
{/each}
</g>
