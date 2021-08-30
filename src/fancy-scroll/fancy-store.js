import {derived, writable} from "svelte/store";
import * as d3 from "d3";
import _ from "lodash";

export const categories = writable([]);
export const clients = writable([]);
export const arcs = writable([]);

export const clientScale = derived(clients, (c) => d3
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
