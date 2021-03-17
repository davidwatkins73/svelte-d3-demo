<script>
    import * as d3 from "d3";

    export let width = 10;
    export let height;

    const data = [1, 3, 6];

    $: y = d3
        .scaleLinear()
        .range([0, height])
        .domain([0, 10]);

</script>

<rect y="0"
      {width}
      height={y(2)}
      fill="#c4ffca"/>
<rect y={y(2)}
      {width}
      height={y(5)}
      fill="#ffd9ab"/>
<rect y={y(7)}
      {width}
      height={y(3)}
      fill="#ffaca7"/>