import * as d3 from "d3";
import _ from "lodash";

/**
 * Create a sankey-like arc, except the starting width and
 * ending width can differ.

 * @param sy  starting y
 * @param sh  starting height
 * @param ey  ending y
 * @param eh  ending height
 * @param distance   distance between start and end x
 * @param tension  how straight the line (0 -> 1, 0 is slack, 1 is taut)
 * @returns {string}
 */
export function mkPathData(sy, sh, ey, eh, distance, tension) {
    const start = {x: 0, y: sy, h: sh};
    const end = {x: distance, y: ey, h: eh};
    const midA = start.x + (end.x - start.x) * tension;
    const midB = start.x + (end.x - start.x) * (1 - tension);
    return `M ${start.x} ${start.y} C ${midB} ${start.y}, ${midA} ${end.y}, ${end.x} ${end.y}
             l 0 ${end.h}
             C ${midA} ${end.y + end.h}, ${midB} ${start.y + start.h}, ${start.x} ${start.y + start.h}
             Z`;
}


export function layout(inData, outData, facetDomain, midPaddingOuter, midPaddingInner= 0.3) {
    const height = 1000;

    const midY = d3
        .scaleBand()
        .domain(_.map(facetDomain.domain, "id"))
        .range([0, height])
        .paddingInner(midPaddingInner)
        .paddingOuter(midPaddingOuter);

    const commonY = d3
        .scaleLinear()
        .range([0, height])
        .domain([0, Math.max(inData.total, outData.total)]);

    const inY = d3
        .scaleLinear()
        .range([
            height / 2 - (commonY(inData.total) / 2),
            height / 2 + (commonY(inData.total) / 2)
        ])
        .domain([0, inData.total]);

    const outY = d3
        .scaleLinear()
        .range([
            height / 2  - (commonY(outData.total) / 2),
            height / 2  + (commonY(outData.total) / 2)
        ])
        .domain([0, outData.total]);


    return {
        in: _.map(
            inData.values,
            d => ({
                data: d,
                sy: inY(d.y),
                sh: inY(d.y + d.h) - inY(d.y),
                ey: midY(d.k),
                eh: midY.bandwidth()
            })),
        out: _.map(
            outData.values,
            d => ({
                sy: midY(d.k),
                sh: midY.bandwidth(),
                ey: outY(d.y),
                eh: outY(d.y + d.h) - outY(d.y)
            })),
        mid: _.map(
            facetDomain.domain,
            d => ({
                y: midY(d.id),
                data: d,
                h: midY.bandwidth()
            }))
    };
}