<script>
    import RemoveLaneButton from "./RemoveLaneButton.svelte";

    export let user;
    export let data;

    export let height;
    export let width;

</script>


<rect x="0"
      {height}
      {width}
      fill="url('#gradient-{user}')">
</rect>

<text dy="-2"
      style="font-size: small">
    {user}
</text>

<g transform="translate( -20)">
    <RemoveLaneButton {height}
                      on:remove/>
</g>