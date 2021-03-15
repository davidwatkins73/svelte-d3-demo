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
    return `M ${start.x} ${start.y} 
            C ${midB} ${start.y}, ${midA} ${end.y}, ${end.x} ${end.y}
            l 0 ${end.h}
            C ${midA} ${end.y + end.h}, ${midB} ${start.y + start.h}, ${start.x} ${start.y + start.h}
            Z`;
}


export function mkStackData(values, activeDomainItems) {
    const idToBucketMap = _.reduce(
        activeDomainItems,
        (acc, d) => {
            d.rollups.forEach(r => acc[r] = d.id);
            return acc;
        },
        {});

    return _
        .chain(values)
        .map(d => idToBucketMap[d.ref]) // domain id
        .reject(d => _.isNil(d))
        .countBy(d => d)
        .reduce(
            (acc, v, k) => {
                const d = {
                    k,
                    y: acc.total,
                    h: v
                };
                acc.values.push(d);
                acc.total += v;
                return acc;
            },
            {total: 0, values: []})
        .value();
}


export function layout(inData,
                       outData,
                       domainItems,
                       height,
                       midPaddingOuter = 0.3,
                       midPaddingInner = 0.3,
                       endpointPadding = 5) {

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