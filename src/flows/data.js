import _ from "lodash";


const names = [
    "Trade", "Fix",  "Book", "Settlement", "Risk", "Equity", "Stock", "Asset", "Innovate", "Finance", "Agreement", "Contract", "Fund",
    "Capture", "Manager", "Explorer", "Commander",
    "Apollo", "Zeus", "Hermes", "Juno", "Jove", "Pegasus",
    "Mercury", "Venus", "Mars", "Pluto", "Neptune", "Jupiter", "Saturn",
];


const dataTypes = [
    {"name":"Book Data","id":1000, "parentId":null},
    {"name":"Counterparty etc.","id":2000, "parentId":null},
        {"name":"Institutional","id":2100, "parentId":2100},
        {"name":"Individual","id":2200, "parentId":2100},
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
    return repeat(partCount, (idx) => randomPick(names))
        .join(" ");
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
        id: `${source.id}#${target.id}`
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


export function mkDataSet(config) {
    const sourceCount = config?.sourceCount || Math.random() * 50 + 1;
    const targetCount = config?.targetCount || Math.random() * 50 + 1;

    const sources = mkEndpoints(sourceCount, "s")
    const targets = mkEndpoints(targetCount, "e")
    const app = mkEndpoint("c");
    const inbound = mkFlows(sources, [app], "in");
    const outbound = mkFlows([app], targets, "out");

    const dtMappings = _
        .chain([])
        .concat(inbound, outbound)
        .flatMap(d => repeat(
            Math.ceil(Math.random() * 3),
            () => ({
                flowId: d.id,
                ref: randomPick(dataTypes).id
            })))
        .value();

    const transportMappings = _
        .chain([])
        .concat(inbound, outbound)
        .map(d => ([{
            flowId: d.id,
            ref: randomPick(transports).id
        }]))
        .value();

    return {
        sources,
        targets,
        app,
        inbound,
        outbound,
        facets: [
            { id: "type", name: "Data Types", domain: dataTypes, values: dtMappings },
            { id: "transport", name: "Data Transports", domain: transports, values: transportMappings },
        ]
    }
}


