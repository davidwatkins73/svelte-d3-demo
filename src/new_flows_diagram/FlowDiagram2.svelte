<script>
    import * as d3 from "d3";

    let el;

    let data = [];

    $: x = d3
        .scaleLinear()
        .domain([2, 12])
        .range([100, 500]);

    $: y = d3
        .scaleLinear()
        .domain([2, 12])
        .range([50, 350]);

</script>

<svg viewBox="0 0 600 400" width="100%" xmlns="http://www.w3.org/2000/svg">
</svg>

<br>
