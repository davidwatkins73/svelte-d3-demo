import _ from "lodash";

export function hierarchyStack() {

    let valueId = d => d.ref;
    let parentId = d => d.id;
    let descendants = d => d.rollups;

    function compute(data, parents) {
        const datumIdToParentIdMap = _.reduce(
            parents,
            (acc, d) => {
                descendants(d).forEach(r => acc[r] = d.id);
                return acc;
            },
            {});

        // broken this up into counts and then a map for the result to make
        // it easier to return the output in the order that the input was given

        const groupedByParentId = _.groupBy(
            data,
            d => datumIdToParentIdMap[valueId(d)]);

        return _
            .chain(parents)
            .map(p => ({
                k: parentId(p),
                values: groupedByParentId[parentId(p)],
                parent: p
            }))
            .reduce(
                (acc, d) => {
                    const r = {...d, y: acc.total, h: d.values.length };
                    acc.values.push(r);
                    acc.total += d.values.length;
                    return acc;
                },
                {total: 0, values: []})
            .value();
    }


    /**
     * Sets or retrieves an accessor function to return domain identifier associate to a data item
     * @param accessor
     */
    compute.valueId = function(accessor) {
        if (arguments.length === 0) return valueId;
        valueId = accessor;
        return this;
    }


    /**
     * Sets or retrieves an accessor function to return a list of descendant identifiers from a domain item
     * @param accessor
     */
    compute.descendants = function(accessor) {
        if (arguments.length === 0) return descendants;
        descendants = accessor;
        return this;
    }


    /**
     * Sets or retrieves an accessor function which returns the id of a parent item
     * @param accessor
     */
    compute.parentId = function(accessor) {
        if (arguments.length === 0) return parentId;
        parentId = accessor;
        return this;
    }


    return compute;
}

