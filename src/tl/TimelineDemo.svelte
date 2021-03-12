<script>
    import Timeline from "./Timeline.svelte"
    import _ from "lodash";
    import * as d3 from "d3";

    const month = {
        JAN: 0,
        FEB: 1,
        MAR: 2,
        APR: 3,
        MAY: 4,
        JUN: 5,
        JUL: 6,
        AUG: 7,
        SEP: 8,
        OCT: 9,
        NOV: 10,
        DEC: 11
    };

    function mkData() {
        return [
            {
                date: new Date(2020, Math.random() * 11, 17),
                rating: 'g',
                label: 'Buy'
            }, {
                date: new Date(2021, Math.random() * 11, 20),
                rating: 'a',
                label: 'Hold'
            }, {
                date: new Date(2022, Math.random() * 11, 20),
                rating: 'r',
                label: 'Sell'
            }, {
                date: new Date(2023, Math.random() * 11, 31),
                rating: 'x',
                label: 'Retire'
            }
        ];
    }

    let timelines = [mkData(), mkData()];
    $: timeExtent = d3.extent(_.flatMap(timelines, xs => _.map(xs, d => d.date)));

    function mwoar() {
        timelines = [...timelines, mkData()];
    }
</script>


<div style="display: inline-block; width:60%;">
    <table style="width: 100%">
        {#each timelines as timeline, idx}
            <tr>
                <td>
                    T{idx}
                </td>
                <td>
                    <Timeline data={timeline}
                              {timeExtent}/>
                </td>
            </tr>
        {/each}
    </table>
</div>
<div style="width: 30%; display: inline-block; vertical-align: top">
    <button on:click={() => mwoar()}>
        Mwoar
    </button>
</div>

