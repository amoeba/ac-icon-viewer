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
	main {
		max-width: 600px;
		margin: 0 auto;
		padding: 40px 20px;
		font-family: system-ui, -apple-system, sans-serif;
	}

	h1 {
		margin: 0 0 24px;
		font-size: 24px;
	}

	footer {
		margin-top: 40px;
		padding-top: 20px;
		border-top: 1px solid #ddd;
		font-size: 14px;
		color: #666;
	}

	footer a {
		color: #0066cc;
		text-decoration: none;
	}

	footer a:hover {
		text-decoration: underline;
	}
</style>
