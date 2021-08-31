import _ from "lodash";

export const dimensions = {
    client: {
        height: 20,
        width: 200
    },
    category: {
        height: 40,
        width: 150
    },
    clientList: {
        paddingTop: 20,
        innerPadding: 1.8
    },
    diagram: {
        height: 500,
        width: 800
    }
};

const catLayout = {
    id: a => a.categoryId,
    scale: (catYPos, cliYPos) => catYPos,
    dimensions: dimensions.category,
    offset: () => 0
}

const cliLayout = {
    id: a => a.clientId,
    scale: (catYPos, cliYPos) => cliYPos,
    dimensions: dimensions.client,
    offset: (x) => x
}

export const layout = {
    categoryToClient: {
        left: catLayout,
        right: cliLayout,
        clientTranslateX: dimensions.diagram.width - dimensions.client.width,
        categoryTranslateX: 0
    },
    clientToCategory: {
        left: cliLayout,
        right: catLayout,
        clientTranslateX: 0,
        categoryTranslateX: dimensions.diagram.width - dimensions.category.width
    }
}


export const activeLayout = layout.clientToCategory;


export function randomPick(xs) {
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