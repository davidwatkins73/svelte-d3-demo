import {derived, writable} from "svelte/store";
import * as d3 from "d3";
import _ from "lodash";

export const categories = writable([]);
export const clients = writable([]);
export const arcs = writable([]);
export const qry = writable(null);
export const dtQry = writable(null);


export const filteredCategories = derived([dtQry, categories], ([q, cats]) => {
    return q == null
        ? cats
        : _.filter(cats, c => c.name.indexOf(q) !== -1);
})


export const filteredClients = derived([qry, clients], ([q, cs]) => {
    return q === null
        ? cs
        : _.filter(cs, c => c.name.indexOf(q) !== -1)
});

export const filteredArcs = derived([arcs, filteredClients, filteredCategories], ([acs, fcs, fcats]) => {

    clientScrollOffset.set(0);

    const filteredClientIds = _.map(fcs, c => c.id);
    const filteredCatIds = _.map(fcats, c => c.id);
    return _.filter(acs, a => _.includes(filteredClientIds, a.clientId) && _.includes(filteredCatIds, a.categoryId));
});


export const ratingColors = d3.scaleOrdinal()
    .domain([0, 1, 2, 3, 4, 5])
    .range(["grey", "red", "green", "pink", "blue", "purple"])

export const clientScale = derived(filteredClients, (c) => d3
    .scaleBand()
    .padding(0.2)
    .domain(_.map(c, "id"))
    .range([0, c.length * 20 || 0]));

export const categoryScale = derived(filteredCategories, c => d3
    .scaleBand()
    .padding(0.2)
    .range([0, 400])
    .domain(_.map(c, "id")));

export const clientScrollOffset = writable(0);
