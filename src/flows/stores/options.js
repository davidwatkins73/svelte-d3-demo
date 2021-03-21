import {writable} from "svelte/store";
import _ from "lodash";

export const selectedFacet = writable("type");

export const history = writable([]);

export const showBreadcrumbs = writable(true);

export const activeRoot = writable(null);


// -- functions ----

export function drillIn(next, curr) {
    if (_.isEmpty(next.data.children)) return;
    history.update(xs => [...xs, curr]);
    activeRoot.set(next.data)
}

export function rewind(mid) {
    history.update(xs => _.takeWhile(xs, x => x !== mid))
    activeRoot.set(mid);
}
