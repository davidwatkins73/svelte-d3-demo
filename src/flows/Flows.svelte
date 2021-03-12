<script>
    import _ from "lodash";

    import {mkDataSet} from "./data";
    import {selectedFacet} from "./stores/options";

    let data = mkDataSet();

    let el;

    let width = 1000;
    let height = 1000;

    $: {
        const nodesById = _.keyBy(
            _.concat(data.sources, data.targets, [data.app]),
            d => d.id);

        const facet = _.find(data.facets, ({id: $selectedFacet}));

        console.log({facet});
    }

</script>

<h1>Flows</h1>

<svg viewBox="0 0 {width} {height}"
     width="100%"
     bind:this={el}
     style="border: 1px solid red">
</svg>

