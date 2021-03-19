import _ from "lodash";


const names1 =[
    "Apollo", "Zeus", "Hermes", "Juno", "Jove", "Pegasus",
    "Mercury", "Venus", "Mars", "Pluto", "Neptune", "Jupiter", "Saturn",
    "Maple", "Oak", "Willow",
    "Jet", "Turbo", "Rapido",
    "Escher", "Bach", "Godel", "Mozart", "Beethoven", "Chopin"

];
const names2 = [
    "Trade", "Fix",  "Book", "Settlement", "Risk", "Equity", "Stock",
    "Asset", "Innovate", "Finance", "Agreement", "Contract", "Fund",
    "Linker"
];
const names3 = [
    "Capture", "Manager", "Explorer", "Commander", "Director", "Navigator",
    "Evaluator", "Calculator", "Reducer", "Compactor", "Mover"
];


const dataTypes = [
    {"name":"Book Data","id":1000, "parentId":null},
    {"name":"Counterparty etc.","id":2000, "parentId":null},
        {"name":"Institutional","id":2100, "parentId":2000},
            {"name":"Commercial","id":2110, "parentId":2100},
                {"name":"Financial","id":2111, "parentId":2110},
                {"name":"Non Financial","id":2112, "parentId":2110},
            {"name":"Government","id":2120, "parentId":2100},
            {"name":"NGO","id":2130, "parentId":2100},
        {"name":"Individual","id":2200, "parentId":2000},
    {"name":"Pricing Data","id":3000, "parentId":null},
        {name: "Commodities", id: 3100, parentId: 3000 },
        {name: "Equities", id: 3200, parentId: 3000 },
        {name: "Fixed", id: 3300, parentId: 3000 },
    {"name":"Transactions etc.","id":4000,"parentId":null},
    {"name":"Interest rates etc","id":5000,"parentId":null},
    {"name":"Currencies etc","id":6000,"parentId":null},
        {"name":"Virtual Currencies","id":6100,"parentId":6000},
            {"name":"Bitcoin","id":6110,"parentId":6100},
            {"name":"Ethereum","id":6112,"parentId":6100},
    {"name":"Unknown","id":1,"parentId":null}
];


const transports = [
    {name: "Database", id: 1},
    {name: "File", id: 2},
    {name: "Messaging", id: 3},
    {name: "RPC", id: 4},
    {name: "UDB", id: 5},
    {name: "Manual", id: 6}
];


function randomPick(arr = []) {
    return arr[Math.floor(Math.random() * arr.length)];
}


function repeat(times, fn) {
    return Array.from({length: times}, (x, idx) => fn(idx));
}


function mkName() {
    const partCount = Math.ceil(Math.random() * 3)
    switch (partCount) {
        case 1:
            return randomPick(names1);
        case 2:
            return [randomPick(names2), randomPick(names3)].join(" ");
        case 3:
            return [randomPick(names1), randomPick(names2), randomPick(names3)].join(" ");
        default:
            return randomPick(names1);
    }
}


function mkEndpoint(id) {
    return {
        id,
        name: mkName(),
        desc: "Description: " + id
    };
}


function mkEndpoints(count = 10, idPrefix = "") {
    return repeat(
        count,
        idx => {
            const id = `${idPrefix}_${idx}`;
            return mkEndpoint(id);
        });
}


function mkFlow(source, target) {
    return {
        source: source.id,
        target: target.id,
        id: `${source.id}#${target.id}`,
        authorityRating: randomPick(["R", "R", "A", "A", "G", "Z"])
    };
}


function mkFlows(sources, targets) {
    let ps = [];
    for(let x of sources) {
        for (let y of targets) {
            ps.push(mkFlow(x, y))
        }
    }
    return ps;
}


function mkFacets(flows = []) {

    const dtMappings = _
        .chain(flows)
        .flatMap(d => repeat(
            Math.ceil(Math.random() * 3),
            () => ({
                flowId: d.id,
                ref: randomPick(dataTypes).id
            })))
        .value();

    const transportMappings = _
        .chain(flows)
        .map(d => ({
            flowId: d.id,
            ref: randomPick(transports).id
        }))
        .value();

    return [
        { id: "type", values: dtMappings },
        { id: "transport", values: transportMappings },
    ]
}


function mkFlowsAndFacets(flows) {
    return {
        flows,
        facets: mkFacets(flows)
    };
}


export function mkDataSet(config) {
    const sourceCount = config?.sourceCount || Math.random() * 50 + 1;
    const targetCount = config?.targetCount || Math.random() * 50 + 1;

    const sources = mkEndpoints(sourceCount, "s")
    const targets = mkEndpoints(targetCount, "e")
    const app = mkEndpoint("c");

    const inboundFlows = mkFlows(sources, [app], "in");
    const outboundFlows = mkFlows([app], targets, "out");

    const inbound = mkFlowsAndFacets(inboundFlows);
    const outbound = mkFlowsAndFacets(outboundFlows);

    return {
        sources,
        targets,
        app,
        inbound,
        outbound,
        facetDomains: [
            { id: "type", values: dataTypes, name: "Data Transports" },
            { id: "transport", values: transports, name: "Data Types" }
        ]
    }
}


