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

