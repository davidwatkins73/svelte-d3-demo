import {writable} from "svelte/store";

export const selectedFacet = writable("type");

export const history = writable([]);

export const showBreadcrumbs = writable(true);