<script>
	import StackChart from "./StackChart.svelte";
	import Sankey from "./Sankey.svelte";
	export let name;
</script>

<main>
	<h1>Hello {name}!</h1>
	<div class="viz">
		<StackChart/>
	</div>
	<div class="viz">
		<Sankey/>
	</div>
</main>

<style>
	.viz {
		display:inline-block;
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

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>