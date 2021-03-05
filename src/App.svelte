<script>
	import StackChart from "./StackChart.svelte";
	import StackBars from "./StackBars.svelte";
	import Circles from "./Circles.svelte";
	import HistoryMainChart from "./mc/HistoryMainChart.svelte";
	import SimpleRadial from "./SimpleRadial.svelte";
	import Splat from "./Splat.svelte";
	import SankeyDemo from "./sankey/SankeyDemo.svelte";
</script>

<main>
	<h1>Visualization Demos</h1>

	<h2>Mini Sankey</h2>
	<div class="viz">
		<SankeyDemo/>
	</div>

	<h2>Splats</h2>
	<div class="viz">
		<Splat/>
	</div>

	<h2>MultiComponent (Git Logs)</h2>
	<div class="viz" style="width: 90%">
		<HistoryMainChart/>
	</div>

	<p>Attempting to use multiple components, combining svelte and d3</p>
	<h2>Simple Radial</h2>
	<div class="viz">
		<SimpleRadial/>
	</div>

	<h2>Stack Bars</h2>
	<div class="viz">
		<StackBars/>
	</div>

	<h2>Stack Area</h2>
	<div class="viz">
		<StackChart/>
	</div>

	<h2>Circles</h2>
	<div class="viz">
		<Circles/>
	</div>
</main>

<style>
	.viz {
		display:inline-block;
		border: 1px solid red;
		width:60%;
	}

	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	h2 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 3em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>