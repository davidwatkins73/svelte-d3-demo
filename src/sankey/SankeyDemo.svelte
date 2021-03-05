<script>
    import {mkData} from "./data.js"
    import {colorBySource} from "./config-store"
    import Sankey from "./Sankey.svelte";


</script>

<width style="display: inline-block; width: 65%">

    <Sankey data={mkData()}/>
    <Sankey data={mkData()}/>
    <Sankey data={mkData()}/>
    <Sankey data={mkData()}/>
    <Sankey data={mkData()}/>
    <Sankey data={mkData()}/>
    <Sankey data={mkData()}/>
    <Sankey data={mkData()}/>
    <Sankey data={mkData()}/>
    <Sankey data={mkData()}/>
    <Sankey data={mkData()}/>
    <Sankey data={mkData()}/>
    <Sankey data={mkData()}/>
    <Sankey data={mkData()}/>
    <Sankey data={mkData()}/>
    <Sankey data={mkData()}/>
    <Sankey data={mkData()}/>
    <Sankey data={mkData()}/>

</width>

<div style="display: inline-block; width: 30%; vertical-align: top">
    <p>Experimenting with lots of tiny sankeys.</p>
    <p>Use the checkbox below to configure how the links are coloured (by-source or by-target)</p>

    <label for="color-by">
        Colour by Source:
        <input id="color-by"
               type="checkbox"
               bind:checked={$colorBySource}>
    </label>

</div>

<style>
</style>