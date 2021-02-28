<script>
    import DeadList from "./DeadList.svelte";

    import {selectedDate} from "./stores/date-selection-store";
    import {showMerges} from "./stores/filters-store";
    import {showWorkDayGuideLines} from "./stores/overlays-store";

    import {prettyDate} from "./utils";
</script>


<div style="padding-top: 1em; color: #888; font-size: smaller" >
    <p>
        This demo uses a slice of the Waltz commit log (2017-2018)
        and charts commits during this period.
    </p>
    <p>
        Use the filter options to remove merge commits, show the
        working day guidelines and restore committers removed from
        the graph.
    </p>
</div>

<div>
    <h3>
        Data
        {#if $selectedDate}
        <span class="selected-date">
            {prettyDate($selectedDate)}
        </span>
        {/if}
    </h3>
</div>

<hr>

<div>
    <h3>Filters</h3>

    <div>
        <label class="inline"
               for="include-merges">
            Include Merges:
        </label>
        <input id="include-merges"
               type="checkbox"
               bind:checked={$showMerges}>
    </div>

    <div>
        <label for="show-workday-guides"
               class="inline">
            Show workday guidelines:
        </label>
        <input id="show-workday-guides"
               type="checkbox"
               bind:checked={$showWorkDayGuideLines}>
        <span style="color: #999"> (8:30 - 17:30)</span>
    </div>


    <label for="deadlist">
        Removed:
    </label>
    <span id="deadlist">
        <DeadList/>
    </span>
</div>

<style>
    .inline {
        display: inline-block;
    }
    .selected-date {
        font-size: smaller;
        color: #888
    }
</style>

