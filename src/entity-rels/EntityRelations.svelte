<script>
    import {model} from "./data-store.js";
    import _ from "lodash";
    import * as d3 from "d3";

    let elem;

    const width = 1000;
    const height = 1000;

    $: links = $model.relationships
        .filter(d => d.source.primary || d.target.primary)
        .map(d => Object.assign(
            {},
            d,
            {
                id: d.source.id + "_" + d.target.id,
                source: d.source.id,
                target: d.target.id,
                value: d.source.primary ? 7 : 3 + d.target.primary ? 7 : 3
            }));


    $: nodes = $model.entities
        // .filter(d => d.primary)
        .map(d => Object.create(d));


    $: {
        console.log({links, nodes})
        let simulation = d3
            .forceSimulation(nodes)
            .force("link", d3
                .forceLink(links)
                .id(d => d.id)
                .distance(100))
            .force("charge", d3.forceManyBody().strength(-100))
            .force("collide", d3.forceCollide().radius(40))
            .force("center", d3.forceCenter(width / 2, height / 2));

        let svg = d3
            .select(elem)
            .attr("viewBox", [0, 0, width, height]);

        let link = svg
            .append("g")
            .attr("stroke", "#bbb")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));

        let node = svg.append("g")
            .selectAll(".node")
            .data(nodes)
            .join("g")
            .classed("node", true)
            .call(drag(simulation));

        node
            .append("circle")
            .attr("r", d => d.primary ? 7 : 4)
            .attr("opacity", 0.8)
            .attr("fill", d => d.primary
                ? "#6fb379"
                : "#adf3b9")

        node.append("text")
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
</svg>

<style>
    svg {
        border: 1px solid red;
    }
    .node {
        pointer-events: all;
    }

    .node text {
        text-anchor: middle;
    }
</style>