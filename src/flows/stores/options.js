import {writable} from "svelte/store";

export const selectedFacet = writable("type");
export const history = writable([]);