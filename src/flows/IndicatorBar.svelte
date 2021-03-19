<script>
    import * as d3 from "d3";

    export let width = 10;
    export let height;
    export let data;

    $: y = d3
        .scaleLinear()
        .range([0, height])
        .domain([0, 10]);

    $: console.log({data})
</script>

<g on:click
   on:mouseenter
   on:mouseleave>
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
</g>
