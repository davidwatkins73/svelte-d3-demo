import {writable} from "svelte/store";

export const selectedFacet = writable("transport");

export const history = writable([]);