import * as d3 from "d3";
import _ from "lodash";


export function flowLayout() {
    let midPaddingOuter = 0.3;
    let midPaddingInner = 0.3;
    let endpointPadding = 5
    let height = 100

    function layout(inData,
                    outData,
                    domainItems) {

        const commonHeight = height - ((domainItems.length - 1) * endpointPadding);

        const commonY = d3
            .scaleLinear()
            .range([0, commonHeight])
            .domain([0, Math.max(inData.total, outData.total)]);

        const inY = d3
            .scaleLinear()
            .domain([0, inData.total])
            .range([
                commonHeight / 2 - (commonY(inData.total) / 2),
                commonHeight / 2 + (commonY(inData.total) / 2)
            ]);

        const outY = d3
            .scaleLinear()
            .domain([0, outData.total])
            .range([
                commonHeight / 2  - (commonY(outData.total) / 2),
                commonHeight / 2  + (commonY(outData.total) / 2)
            ]);

        const midY = d3
            .scaleBand()
            .domain(_.map(domainItems, d => d.id))
            .range([0, height])
            .paddingInner(midPaddingInner)
            .paddingOuter(midPaddingOuter);

        return {
            in: _.map(
                inData.values,
                (d, i) => ({
                    data: d,
                    sy: inY(d.y) + (endpointPadding * (i)),
                    sh: inY(d.y + d.h) - inY(d.y),
                    ey: midY(d.k),
                    eh: midY.bandwidth()
                })),
            out: _.map(
                outData.values,
                (d, i) => ({
                    data: d,
                    sy: midY(d.k),
                    sh: midY.bandwidth(),
                    ey: outY(d.y) + (endpointPadding * (i)),
                    eh: outY(d.y + d.h) - outY(d.y)
                })),
            mid: _.map(
                domainItems,
                d => ({
                    y: midY(d.id),
                    data: d,
                    h: midY.bandwidth()
                }))
        };
    }

    layout.midPaddingOuter = function (d) {
        if (!arguments.length) return midPaddingOuter;
        midPaddingOuter = d;
        return this;
    }

    layout.midPaddingInner = function (d) {
        if (!arguments.length) return midPaddingInner;
        midPaddingInner = d;
        return this;
    }

    /**
     * Padding between endpoints at the edges of the graph,
     * Used to give more 'breathing room' between arcs.
     *
     * This is a raw value, not a proportional value.
     */
    layout.endpointPadding = function (d) {
        if (!arguments.length) return endpointPadding;
        endpointPadding = d;
        return this;
    }

    layout.height = function(d) {
        if (!arguments.length) return height;
        height = d;
        return this;
    }

    return layout;
}