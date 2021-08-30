<script>
    import {categories, categoryScale} from "./fancy-store";

</script>

{#each $categories as category}
    <g transform={`translate(0, ${$categoryScale(category)})`}>
        <rect fill="#eee"
              stroke="#ccc"
              width="150"
              height={$categoryScale.bandwidth()}/>
        <text dx="16"
              dy={$categoryScale.bandwidth()/2 + 8}>
            {category}
        </text>
    </g>
{/each}