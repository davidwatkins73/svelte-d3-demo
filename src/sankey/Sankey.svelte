<script>
    import * as d3core from "d3";
    import * as d3sk from "d3-sankey";
    import _ from "lodash";

    import {cmp, mkColorScales, toChartDimensions} from "./utils";
    import {colorBySource} from "./config-store";

    const d3 = {
        ...d3core,
        ...d3sk
    };

    const dimensions = {
        height: 1500,
        width: 1000
    };

    const margins = {
        left: 100,
        right: 100,
        top: 100,
        bottom: 100
    };


    const sankeyLayoutFn = (data) => d3
        .sankey()
        .nodeId(d => d.id)
        .nodeWidth(100)
        .nodePadding(50)
        .nodeSort((a, b) => cmp(a.rank, b.rank))
        .extent([[0, 0], [chartDimensions.width, chartDimensions.height]])
        ({
            nodes: data.nodes.map(n => Object.assign({}, n)),
            links: data.links.map(l => Object.assign({}, l))
        });


    const chartDimensions = toChartDimensions(dimensions, margins);


    function drawNodes(layout, elem, color) {
        const nodes = elem
            .selectAll(".node")
            .data(layout.nodes, d => d.id);

        const newNodes = nodes
            .enter()
            .append("rect")
            .classed("node", true)
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .style("fill", d => color(d.category.code));

        nodes
            .merge(newNodes)
            .transition()
            .duration(200)
            .attr("y", d => d.y0)
            .attr("height", d => d.y1 - d.y0);

        nodes.exit().remove();
    }


    function drawLinks(layout, linksElem, color, categoryProvider = d => d.source.category.code) {
        const links = linksElem
            .selectAll(".link")
            .data(layout.links, d => `${d.source.id}_${d.target.id}`);

        const newLinks = links
            .enter()
            .append("path")
            .classed("link", true)
            .attr("d", d3.sankeyLinkHorizontal())
            .style("stroke", d => color(categoryProvider(d)))
            .style("stroke-width", d => Math.max(1, d.width))
            .style("fill", "none")
            .style("opacity", 0.6);

        links
            .merge(newLinks)
            .transition()
            .duration(200)
            .attr("d", d3.sankeyLinkHorizontal())
            .style("stroke", d => color(categoryProvider(d)))
            .style("stroke-width", d => Math.max(1, d.width))
    }


    // -- responsive bit

    export let data = [];

    let svgEl;
    let chartEl;
    let scales;

    $: {
        const scales = mkColorScales(data);
        const nodesElem = d3.select(chartEl).select(".nodes");
        const linksElem = d3.select(chartEl).select(".links");

        const layout = sankeyLayoutFn(data);

        drawNodes(
            layout,
            nodesElem,
            scales.fg);

        drawLinks(
            layout,
            linksElem,
            scales.bg,
            $colorBySource
                ? d => d.source.category.code
                : d => d.target.category.code);
    }

</script>

<div style="display: inline-block">
    <svg bind:this={svgEl}
         width="40"
         height="60"
         viewbox="0 0 {dimensions.width} {dimensions.height}">
        <g transform="translate({margins.left} {margins.top})"
           bind:this={chartEl}>
            <g class="nodes"></g>
            <g class="links"></g>
        </g>
    </svg>

</div>


<style>
    svg {

    }
</style>