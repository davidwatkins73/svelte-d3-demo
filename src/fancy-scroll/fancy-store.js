import {derived, writable} from "svelte/store";
import * as d3 from "d3";
import _ from "lodash";

export const categories = writable([]);
export const clients = writable([]);
export const arcs = writable([]);
export const qry = writable(null);

export const filteredClients = derived([qry, clients], ([q, cs]) => {
    return q === null
        ? cs
        : _.filter(cs, c  => c.name.indexOf(q) !== -1)
});


export const filteredArcs = derived([arcs, filteredClients], ([acs, fcs]) => {

    clientScrollOffset.set(0);

    const filteredClientIds = _.map(fcs, c => c.id);
    return _.filter(acs, a => _.includes(filteredClientIds, a.clientId));
});


// turn cat into another object, indictor for plus, sepearte search for groups

// affects other derived clients/arcs



export const ratingColors = d3.scaleOrdinal()
    .domain([0, 1, 2, 3, 4, 5])
    .range(["grey", "red", "green", "pink", "blue", "purple"])

export const clientScale = derived(filteredClients, (c) => d3
    .scaleBand()
    .padding(0.2)
    .domain(_.map(c, "id"))
    .range([0, c.length * 20 || 0]));

export const categoryScale = derived(categories, c => d3
    .scaleBand()
    .padding(0.2)
    .range([0, 400])
    .domain(c));

export const clientScrollOffset = writable(0);
