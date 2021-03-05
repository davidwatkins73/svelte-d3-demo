import _ from "lodash";
import * as d3 from "d3";

export function toChartDimensions(dimensions, margins) {
    return {
        width: dimensions.width - (margins.left + margins.right),
        height: dimensions.height - (margins.top + margins.bottom)
    };
}

export function cmp(a, b) {
    if (a === b) return 0;
    if (a > b) return 1;
    else return -1;
}


export function mkColorScales(data) {
    const categories = _
        .chain(data.nodes)
        .map(d => d.category)
        .uniqBy(d => d.code)
        .value();

    const fgColor = d3
        .scaleOrdinal()
        .domain(categories.map(d => d.code))
        .range(categories.map(d => d.color));

    const bgColor = d3
        .scaleOrdinal()
        .domain(fgColor.domain())
        .range(fgColor.range().map(c => d3.hsl(c).brighter(0.2)))

    return {fg: fgColor, bg: bgColor};
}
