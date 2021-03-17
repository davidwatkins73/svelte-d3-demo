import {mkPathData} from "./util";
import _ from "lodash";

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

