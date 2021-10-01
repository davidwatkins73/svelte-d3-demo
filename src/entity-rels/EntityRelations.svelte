<script>
    import {model} from "./data-store.js";
    import _ from "lodash";
    import * as d3 from "d3";

    function linkToId(d) {
        return d.source + "_" + d.target;
    }

    function selectTag(tag) {
        selectedTag = tag;
        simulation
            .alpha(0.5)
            .restart();
    }

    function clearSelectedTag() {
        selectedTag = null;
    }

    let elem;

    const width = 1000;
    const height = 1000;

    $: tags = _.values($model.tags);
    $: selectedTag = _.find(tags, t => t.name === 'BCBS');

    $: links = $model
        .relationships
        .filter(d => selectedTag === null || _.includes(d.tags, selectedTag))
        .map(d => Object.assign(
            {},
            d,
            {
                id: d.source.id + "_" + d.target.id,
                source: d.source.id,
                target: d.target.id,
                value: d.source.primary ? 7 : 3 + d.target.primary ? 7 : 3
            }));

    $: taggedNodeIds = _
        .chain(links)
        .flatMap(d => [d.source, d.target])
        .uniq()
        .value();

    $: nodes = $model
        .entities
        .map(d => Object.create(d));

    $: simulation = d3
        .forceSimulation(nodes, d => d.id)
        .force("link", d3
            .forceLink(links, linkToId)
            .id(d => d.id)
            .distance(80))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("collide", d3.forceCollide().radius(50))
        .force("center", d3.forceCenter(width / 2, height / 2));

    $: {
        let svg = d3
            .select(elem)
            .attr("viewBox", [0, 0, width, height]);

        let link = svg
            .select(".links")
            .attr("stroke", "#bbb")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links, linkToId)
            .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));

        let node = svg
            .select(".nodes")
            .selectAll(".node")
            .data(nodes, d => d.id)
            .join("g")
            .classed("node", true)
            .attr("opacity", d => _.includes(taggedNodeIds, d.id)
                ? 0.8
                : 0.2)
            .call(drag(simulation));

        node
            .append("circle")
            .attr("r", d => d.primary ? 7 : 4)
            .attr("fill", d => d.primary
                ? "#6fb379"
                : "#adf3b9")

        node
            .append("text")
            .attr("fill", "grey")
            .attr("dy", 16)
            .attr("dx", d => d.name.length * -3)
            .text(d => d.name);

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("transform", d => `translate(${d.x} ${d.y})`)
        });
    }

    function drag(simulation) {

        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

</script>

<svg width="100%"
     bind:this={elem}>
    <g class="nodes"/>
    <g class="links"/>
</svg>

<ul>
    {#each tags as tag}
        <li>
            <button style={`background-color: ${selectedTag === tag ? "#999" : "#ccc"};`}
                    class="btn-skinny"
                    on:click={() => selectTag(tag)}>
                {tag.name}
            </button>
        </li>
    {/each}
    <li>
        <button class="btn-skinny" on:click={() => clearSelectedTag()}>Show All</button>
    </li>
</ul>

<style>
    svg {
        border: 1px solid red;
    }
    .node {
        pointer-events: all;

    }

    .node text {
        text-anchor: middle;
        user-select: none;
    }
</style>