<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import WeenieSearch from '$lib/components/WeenieSearch.svelte';
	import WeenieDetail from '$lib/components/WeenieDetail.svelte';
	import type { WeenieSearchResult } from '$lib/api/acedb';

	let selectedClassId = $derived(
		$page.url.searchParams.get('id') ? Number($page.url.searchParams.get('id')) : null
	);

	function handleSelect(weenie: WeenieSearchResult) {
		goto(`?id=${weenie.class_Id}`, { replaceState: false, keepFocus: true });
	}
</script>

<svelte:head>
	<title>AC Icon Viewer</title>
</svelte:head>

<main>
	<h1>AC Icon Viewer</h1>
	<WeenieSearch onSelect={handleSelect} />

	{#if selectedClassId}
		<WeenieDetail classId={selectedClassId} />
	{/if}

	<footer>
		Data from <a href="https://treestats.net" target="_blank" rel="noopener">TreeStats</a> |
		<a href="https://acedb.treestats.net" target="_blank" rel="noopener">ACEdb</a> |
		<a href="https://dats.treestats.net" target="_blank" rel="noopener">DATs</a>
	</footer>
</main>

<style>
	:global(body) {
		margin: 0;
		min-height: 100vh;
		background: linear-gradient(180deg, #f5f4f2 0%, #eae8e4 100%);
	}

	main {
		max-width: 600px;
		min-width: 300px;
		margin: 0 auto;
		padding: 16px 12px;
		font-family: system-ui, -apple-system, sans-serif;
	}

	h1 {
		margin: 0 0 16px;
		font-size: 22px;
		font-weight: 600;
		background: linear-gradient(135deg, #8b7355 0%, #c9a227 50%, #8b7355 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	footer {
		margin-top: 32px;
		padding: 16px;
		background: linear-gradient(145deg, #fafaf8 0%, #f0eeea 100%);
		border: 1px solid #d8d4cc;
		border-top: 2px solid rgba(139, 115, 85, 0.3);
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(139, 115, 85, 0.06);
		font-size: 13px;
		color: #666;
		text-align: center;
	}

	footer a {
		color: #2c4a7c;
		text-decoration: none;
		font-weight: 500;
	}

	footer a:hover {
		color: #8b2635;
		text-decoration: underline;
	}

	@media (min-width: 480px) {
		main {
			padding: 24px 16px;
		}

		h1 {
			font-size: 24px;
			margin-bottom: 20px;
		}

		footer {
			margin-top: 40px;
			padding: 18px;
			font-size: 14px;
		}
	}

	@media (min-width: 768px) {
		main {
			padding: 40px 20px;
		}

		h1 {
			font-size: 26px;
			margin-bottom: 24px;
		}

		footer {
			margin-top: 48px;
			padding: 20px;
		}
	}
</style>
