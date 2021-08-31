<script>
    import {filteredCategories, categoryScale} from "./fancy-store";

</script>

{#each $filteredCategories as category}
    <g transform={`translate(0, ${$categoryScale(category.id)})`}>
        <rect fill="#eee"
              stroke="#ccc"
              width="150"
              height={40}/>
        <text dx="16"
              dy={20 + 8}>
            {category.name}
        </text>
        <text dx="120"
              dy={20 + 8}>
            {category.hasChildren ? "+" : "-"}
        </text>
    </g>
{/each}