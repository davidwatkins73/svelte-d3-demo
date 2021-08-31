<script>
    import {filteredCategories, categoryScale} from "./fancy-store";
    import {dimensions} from "./fancy-utils"

</script>

{#each $filteredCategories as category}
    <g transform={`translate(0, ${$categoryScale(category.id)})`}>
        <rect fill="#eee"
              stroke="#ccc"
              width={dimensions.category.width}
              height={dimensions.category.height}/>
        <text dx="16"
              dy={dimensions.category.height / 2 + 8}>
            {category.name}
        </text>
        <text dx="120"
              dy={dimensions.category.height / 2 + 8}>
            {category.hasChildren ? "+" : "-"}
        </text>
    </g>
{/each}