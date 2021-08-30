<script>
	import StackChart from "./StackChart.svelte";
	import StackBars from "./StackBars.svelte";
	import Circles from "./Circles.svelte";
	import HistoryMainChart from "./mc/HistoryMainChart.svelte";
	import SimpleRadial from "./SimpleRadial.svelte";
	import Splat from "./Splat.svelte";
	import SankeyDemo from "./sankey/SankeyDemo.svelte";
	import Curves from "./Curves.svelte";
	import TimelineDemo from "./tl/TimelineDemo.svelte";
	import Flows from "./flows/Flows.svelte";
	import CurveDemo from "./flows/CurveDemo.svelte";
	import ColorPickerDemo from "./cp/ColorPickerDemo.svelte";
	import Fun from "./Fun.svelte";
	import FancyScroll from "./fancy-scroll/FancyScroll.svelte";
</script>

<main>
	<h1>Visualization Demos</h1>
	<p>
		A collection of simple visualisations created whilst learning about Svelte and D3.
		Code available on <a href="https://github.com/davidwatkins73/svelte-d3-demo">GitHub</a>.
	</p>

	<h2>Fancy Scroll</h2>
	<div class="viz">
		<FancyScroll/>
	</div>

	<h2>Fun</h2>
	<div class="viz">
		<Fun/>
	</div>

	<h2>Flows</h2>
	<div class="viz">
		<Flows/>
	</div>

	<h2>Colors</h2>
	<div class="viz">
		<ColorPickerDemo/>
		<p>Simple color picker (x3)</p>
	</div>

	<h2>Curves 2</h2>
	<div class="viz">
		<CurveDemo/>
	</div>

	<h2>Timelines</h2>
	<div class="viz">
		<TimelineDemo/>
	</div>

	<h2>Curves</h2>
	<div class="viz">
		<Curves/>
	</div>

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