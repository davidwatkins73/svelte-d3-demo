import _ from "lodash";


export function mkStackData(values, activeDomainItems) {
    const idToBucketMap = _.reduce(
        activeDomainItems,
        (acc, d) => {
            d.rollups.forEach(r => acc[r] = d.id);
            return acc;
        },
        {});

    return _
        .chain(values)
        .map(d => idToBucketMap[d.ref]) // domain id
        .reject(d => _.isNil(d))
        .countBy(d => d)
        .reduce(
            (acc, v, k) => {
                const d = {
                    k,
                    y: acc.total,
                    h: v
                };
                acc.values.push(d);
                acc.total += v;
                return acc;
            },
            {total: 0, values: []})
        .value();
}

