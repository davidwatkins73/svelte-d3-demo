import _ from "lodash";
import * as d3 from "d3";


const HEADER = [
    "hash",
    "committer",
    "time",
    "comment"].join("\t");


const nameReplacements = {
    "dave watkins": "Dave",
    "david watkins": "Dave",
    "dave watkis": "Dave",
    "kamran": "Kam",
    "kamransaleem": "Kam",
    "kamran saleem": "Kam",
    "salekam": "Kam",
    "thang to": "Thang",
    "rohit vats": "Rohit"
};


function sanitize(xs = []) {
    return _.map(xs, x => Object.assign(
        {},
        x,
        {
            date: new Date(x.time),
            committer: _.get(
                nameReplacements,
                [_.lowerCase(x.committer)],
                x.committer)}));
}


export function loadData() {
    return d3
        .text("./mc/data.tsv")
        .then(d => d3.tsvParse(HEADER + "\n" + d))
        .then(d => sanitize(d));
}


export function groupByUser(data, killList) {
    return _.chain(data)
        .groupBy("committer")
        .omit(killList)
        .value();
}


export function mkDateScale(data = []) {
    return d3
        .scaleUtc()
        .domain(d3.extent(data, d => d.date));
}


export function evtToSVGCoords(evt, el) {
    const pt = evt.target.ownerSVGElement.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;

    // The cursor point, translated into svg coordinates
    return pt.matrixTransform(el.getScreenCTM().inverse());
}

const dateFormat = d3.timeFormat("%B %d, %Y");

export function prettyDate(d) {
    return dateFormat(d);
}