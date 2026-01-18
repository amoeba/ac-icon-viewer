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
	}

	.search-input {
		width: 100%;
		padding: 12px 14px;
		font-size: 16px;
		background: linear-gradient(145deg, #fffffe 0%, #faf9f7 100%);
		border: 1px solid #d8d4cc;
		border-radius: 10px;
		box-sizing: border-box;
		box-shadow:
			0 2px 8px rgba(139, 115, 85, 0.06),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
	}

	.search-input:focus {
		outline: none;
		border-color: #c9a227;
		box-shadow:
			0 2px 12px rgba(201, 162, 39, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
	}

	.search-input::placeholder {
		color: #a09080;
	}

	.loading {
		position: absolute;
		right: 14px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 11px;
		color: #8b7355;
		font-weight: 500;
	}

	.results-dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin: 6px 0 0;
		padding: 6px 0;
		list-style: none;
		background: linear-gradient(145deg, #fffffe 0%, #faf9f7 100%);
		border: 1px solid #d8d4cc;
		border-radius: 10px;
		box-shadow: 0 8px 24px rgba(139, 115, 85, 0.15);
		max-height: 280px;
		overflow-y: auto;
		z-index: 100;
	}

	.result-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 14px;
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.result-item:hover,
	.result-item.selected {
		background: linear-gradient(145deg, #f5f3ef 0%, #ebe8e2 100%);
	}

	.result-name {
		font-weight: 500;
		color: #3a3530;
		font-size: 14px;
	}

	.result-id {
		font-size: 11px;
		color: #8b7355;
		font-weight: 500;
	}

	@media (min-width: 480px) {
		.search-input {
			padding: 13px 15px;
			border-radius: 11px;
		}

		.loading {
			right: 15px;
			font-size: 12px;
		}

		.results-dropdown {
			margin-top: 7px;
			padding: 7px 0;
			border-radius: 11px;
			max-height: 300px;
		}

		.result-item {
			padding: 11px 15px;
		}

		.result-name {
			font-size: 15px;
		}

		.result-id {
			font-size: 12px;
		}
	}

	@media (min-width: 768px) {
		.search-input {
			padding: 14px 16px;
			border-radius: 12px;
		}

		.loading {
			right: 16px;
			font-size: 12px;
		}

		.results-dropdown {
			margin-top: 8px;
			padding: 8px 0;
			border-radius: 12px;
			max-height: 320px;
		}

		.result-item {
			padding: 12px 16px;
		}

		.result-name {
			font-size: 16px;
		}

		.result-id {
			font-size: 12px;
		}
	}
</style>
