import {derived, writable} from "svelte/store";
import * as d3 from "d3";
import _ from "lodash";

function randomPick(xs) {
    if (!xs) throw new Error("Cannot pick from a null set of options");

    const choiceCount = xs.length - 1;
    const idx = Math.round(Math.random() * choiceCount);
    return xs[idx];
}


export function mkCategories(){
    return ["A", "B", "C", "D", "E"]
}


export function mkClients(){
    return _
        .range(0, 140)
        .map(d => ({
            name: `c${d}`,
            id: d
        }))
}


export function mkArcs(clients){
    return _
        .chain(clients)
        .flatMap(d => _.map(
            _.range(Math.ceil(Math.random() * 5)),
            () => ({
                clientId: d.id,
                categoryId: randomPick(["A", "B", "C", "D", "E", "B", "B", "D"]),
                ratingId: Math.ceil(Math.random() * 6)
            })))
        .value();
}