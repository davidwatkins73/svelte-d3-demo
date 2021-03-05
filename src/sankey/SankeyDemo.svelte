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

<div class="info">
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
    .info {
        display: inline-block;
        width: 30%;
        vertical-align: top;
        color: #777;
        font-size: smaller;
    }

    .info label {
        font-size: larger;
        color: #333
    }
</style>