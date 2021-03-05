<script>
    import {mkData} from "./Data.js"
    import {colorBySource} from "./config-store"
    import Sankey from "./Sankey.svelte";


</script>

<div style="display: inline-block">
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

    <label for="color-by">
        Colour by Source:
        <input id="color-by"
               type="checkbox"
               bind:checked={$colorBySource}>
    </label>
</div>

<style>
</style>