import _ from "lodash";
import {randomPick} from "./fancy-utils";

export function mkClients(){
    return _
        .range(0, 80)
        .map(d => ({
            name: `C${d}`,
            id: d
        }))
}

export function mkCategories(){
    return _
        .range(1, 15)
        .map(d => ({
            name: `Category ${d}`,
            id: d,
            hasChildren: d % 3 === 0
        }));
}


export function mkArcs(clients, categories){

    let id = 0;

    return _
        .chain(clients)
        .flatMap(d => _.map(
            _.range(Math.ceil(Math.random() * 5)),
            () => ({
                id: id++,
                clientId: d.id,
                categoryId: randomPick(_.map(categories, d => d.id)),
                ratingId: Math.ceil(Math.random() * 6), // overall flow rating
                tipRatings: mkTipRatings()
            })))
        .uniqBy(d => d.clientId + '_' + d.categoryId)
        .value();
}


function mkTipRatings(){
    if (Math.random() > 0.5) {
        return null;
    } else {
        return [
            {ratingId: 0, count: Math.floor(Math.random() * 4)},
            {ratingId: 1, count: Math.floor(Math.random() * 8)},
            {ratingId: 2, count: Math.floor(Math.random() * 16)},
            {ratingId: 3, count: Math.floor(Math.random() * 4)}
        ]
    }
}