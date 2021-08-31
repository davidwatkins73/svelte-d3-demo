<script>
    import {filteredCategories, categoryScale} from "./fancy-store";
    import {dimensions} from "./fancy-utils"

</script>

{#each $filteredCategories as category}
    <g transform={`translate(0, ${$categoryScale(category.id)})`}>
        <rect fill="#f4fff0"
              stroke="#ccc"
              rx={dimensions.category.height / 2}
              width={dimensions.category.width}
              height={$categoryScale.bandwidth()}/>
        <text dx="16"
              dy={$categoryScale.bandwidth() / 2 + 8}>
            {category.name}
        </text>
        <text dx="120"
              dy={$categoryScale.bandwidth() / 2 + 8}>
            {category.hasChildren ? "+" : "-"}
        </text>
    </g>
{/each}