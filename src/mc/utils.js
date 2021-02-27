import _ from "lodash";
import * as d3 from "d3";


const HEADER = [
    "hash",
    "committer",
    "time",
    "comment"].join("\t");


const fixes = {
    "Dave Watkins": "David Watkins",
    "Dave Watkis": "David Watkins",
    "Kamran": "Kamran Saleem",
    "kamransaleem": "Kamran Saleem",
    "salekam": "Kamran Saleem"
};


function sanitize(xs = []) {
    return _.map(
        xs,
        x => Object.assign({}, x, { committer: fixes[x.committer] || x.committer }));
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