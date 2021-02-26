<script>
	import StackChart from "./StackChart.svelte";
	import StackBars from "./StackBars.svelte";
	import Circles from "./Circles.svelte";
	import Radar from "./Radar.svelte";
	import SimpleRadial from "./SimpleRadial.svelte";

	export let name;
</script>

<main>
	<h1>Visualization Demos</h1>

	<h2>Simple Radial</h2>
	<div class="viz">
		<SimpleRadial/>
	</div>

	<h2>Radar</h2>
	<div class="viz">
		<Radar/>
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
		width:50%;
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