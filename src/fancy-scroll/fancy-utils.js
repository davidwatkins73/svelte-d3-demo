import {derived, writable} from "svelte/store";
import * as d3 from "d3";
import _ from "lodash";


export const dimensions = {
    client: {
        height: 40,
        width: 100
    },
    category: {
        height: 60,
        width: 200
    },
    clientList: {
        paddingTop: 100
    },
    diagram: {
        width: 500,
        height: 500
    }
};


function randomPick(xs) {
    if (!xs) throw new Error("Cannot pick from a null set of options");

    const choiceCount = xs.length - 1;
    const idx = Math.round(Math.random() * choiceCount);
    return xs[idx];
}


export function mkClients(){
    return _
        .range(0, 140)
        .map(d => ({
            name: `C${d}`,
            id: d
        }))
}

export function mkCategories(){
    return _
        .range(1, 7)
        .map(d => ({
            name: `Category ${d}`,
            id: d,
            hasChildren: d % 3 == 0
        }))
}


export function mkArcs(clients, categories){
    return _
        .chain(clients)
        .flatMap(d => _.map(
            _.range(Math.ceil(Math.random() * 5)),
            () => ({
                clientId: d.id,
                categoryId: randomPick(_.map(categories, d => d.id)),
                ratingId: Math.ceil(Math.random() * 6)
            })))
        .value();
}