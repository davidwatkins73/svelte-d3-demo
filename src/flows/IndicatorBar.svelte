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
      height={y(1)}
      fill="#ffaca7"/>
<rect y={y(1)}
      {width}
      height={y(3)}
      fill="#ffd9ab"/>
<rect y={y(4)}
      {width}
      height={y(6)}
      fill="#c4ffca"/>