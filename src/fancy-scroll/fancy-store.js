import {derived, writable} from "svelte/store";
import * as d3 from "d3";
import _ from "lodash";
import {dimensions} from "./fancy-utils"

export const layoutDirections = {
    categoryToClient: "categoryToClient",
    clientToCategory: "clientToCategory"
}

export const categories = writable([]);
export const clients = writable([]);
export const arcs = writable([]);
export const clientQry = writable(null);
export const categoryQry = writable(null);
export const layoutDirection = writable(layoutDirections.categoryToClient)

export const filteredCategories = derived([categoryQry, categories], ([q, cats]) => {
    return q == null
        ? cats
        : _.filter(cats, c => c.name.indexOf(q) !== -1);
})

export const filteredClients = derived([clientQry, clients], ([q, cs]) => {
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
    .range([0, c.length * dimensions.client.height * dimensions.clientList.innerPadding || 0]));

export const categoryScale = derived(filteredCategories, c => d3
    .scaleBand()
    .padding(0.2)
    .range([0, 400])
    .domain(_.map(c, "id")));

export const clientScrollOffset = writable(0);


export const layout = derived(
    [layoutDirection, clientScale, categoryScale],
    ([layoutDir, cliScale, catScale]) => {
        const catLayout = {
            id: a => a.categoryId,
            scale: catScale,
            dimensions: dimensions.category,
            offset: () => 0
        }

        const cliLayout = {
            id: a => a.clientId,
            scale: cliScale,
            dimensions: dimensions.client,
            offset: (x) => x
        }

        if (layoutDir === layoutDirections.categoryToClient) {
            return {
                left: catLayout,
                right: cliLayout,
                clientTranslateX: dimensions.diagram.width - dimensions.client.width,
                categoryTranslateX: 0
            }
        } else if (layoutDir === layoutDirections.clientToCategory) {
            return {
                left: cliLayout,
                right: catLayout,
                clientTranslateX: 0,
                categoryTranslateX: dimensions.diagram.width - dimensions.category.width
            }
        } else {
            throw "layout direction: '" + layoutDir + "' not recognised!!"
        }
    });
