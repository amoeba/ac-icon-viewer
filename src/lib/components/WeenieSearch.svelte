<script lang="ts">
	import { searchWeenies, type WeenieSearchResult } from '$lib/api/acedb';

	interface Props {
		onSelect: (weenie: WeenieSearchResult) => void;
	}

	let { onSelect }: Props = $props();

	let query = $state('');
	let results = $state<WeenieSearchResult[]>([]);
	let isOpen = $state(false);
	let selectedIndex = $state(-1);
	let isLoading = $state(false);
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	async function doSearch(searchQuery: string) {
		if (!searchQuery.trim()) {
			results = [];
			isOpen = false;
			return;
		}

		isLoading = true;
		try {
			results = await searchWeenies(searchQuery);
			isOpen = results.length > 0;
			selectedIndex = -1;
		} catch (e) {
			console.error('Search error:', e);
			results = [];
		} finally {
			isLoading = false;
		}
	}

	function handleInput() {
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => doSearch(query), 300);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!isOpen) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				selectedIndex = Math.max(selectedIndex - 1, -1);
				break;
			case 'Enter':
				e.preventDefault();
				if (selectedIndex >= 0 && results[selectedIndex]) {
					selectWeenie(results[selectedIndex]);
				}
				break;
			case 'Escape':
				e.preventDefault();
				isOpen = false;
				selectedIndex = -1;
				break;
		}
	}

	function selectWeenie(weenie: WeenieSearchResult) {
		onSelect(weenie);
		query = weenie.name ?? weenie.class_Name;
		isOpen = false;
		selectedIndex = -1;
	}
</script>

<div class="search-container">
	<input
		type="text"
		bind:value={query}
		oninput={handleInput}
		onkeydown={handleKeydown}
		onfocus={() => results.length > 0 && (isOpen = true)}
		placeholder="Search weenies..."
		class="search-input"
	/>
	{#if isLoading}
		<span class="loading">Loading...</span>
	{/if}

	{#if isOpen && results.length > 0}
		<ul class="results-dropdown" role="listbox">
			{#each results as result, i}
				<li
					class="result-item"
					class:selected={i === selectedIndex}
					role="option"
					aria-selected={i === selectedIndex}
					onmouseenter={() => (selectedIndex = i)}
					onclick={() => selectWeenie(result)}
					onkeydown={(e) => e.key === 'Enter' && selectWeenie(result)}
					tabindex="-1"
				>
					<span class="result-name">{result.name ?? result.class_Name}</span>
					<span class="result-id">#{result.class_Id}</span>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.search-container {
		position: relative;
		width: 100%;
		max-width: 400px;
	}

	.search-input {
		width: 100%;
		padding: 10px 12px;
		font-size: 16px;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
	}

	.search-input:focus {
		outline: none;
		border-color: #666;
	}

	.loading {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 12px;
		color: #888;
	}

	.results-dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin: 4px 0 0;
		padding: 0;
		list-style: none;
		background: white;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		max-height: 300px;
		overflow-y: auto;
		z-index: 100;
	}

	.result-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 12px;
		cursor: pointer;
	}

	.result-item:hover,
	.result-item.selected {
		background: #f0f0f0;
	}

	.result-name {
		font-weight: 500;
	}

	.result-id {
		font-size: 12px;
		color: #888;
	}
</style>
