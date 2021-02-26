import _ from "lodash";

export function sanitize(xs = []) {
    const fixes = {
        "Dave Watkins": "David Watkins",
        "Dave Watkis": "David Watkins",
        "Kamran": "Kamran Saleem",
        "kamransaleem": "Kamran Saleem",
        "salekam": "Kamran Saleem"
    };

    return _.map(
        xs,
        x => Object.assign({}, x, { committer: fixes[x.committer] || x.committer }));
}
