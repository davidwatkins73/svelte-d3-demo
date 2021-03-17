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


export function arc() {
    let tension = 0.7;
    let width = 300;

    function compute(d) {
        return mkPathData(d.sy, d.sh, d.ey, d.eh, width, tension);
    }

    compute.width = function(d) {
        if (arguments.length === 0) return width;
        width = d;
        return this;
    }

    compute.tension = function(d) {
        if (arguments.length === 0) return tension;
        tension = d;
        return this;
    }

    return compute;
}


export function mkArcs(xs, arcFn) {
    return _.map(
        xs,
        d => ({...d, path: arcFn(d)}));
}

