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
		margin: 0 auto;
		padding: 40px 20px;
		font-family: system-ui, -apple-system, sans-serif;
	}

	h1 {
		margin: 0 0 24px;
		font-size: 26px;
		font-weight: 600;
		background: linear-gradient(135deg, #8b7355 0%, #c9a227 50%, #8b7355 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	footer {
		margin-top: 48px;
		padding: 20px;
		background: linear-gradient(145deg, #fafaf8 0%, #f0eeea 100%);
		border: 1px solid #d8d4cc;
		border-top: 2px solid rgba(139, 115, 85, 0.3);
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(139, 115, 85, 0.06);
		font-size: 14px;
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
</style>
