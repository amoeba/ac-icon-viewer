<script lang="ts">
	import { getWeenie, buildIconUrl, type WeenieDetail } from '$lib/api/acedb';

	interface Props {
		classId: number;
	}

	let { classId }: Props = $props();

	let weenie = $state<WeenieDetail | null>(null);
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	$effect(() => {
		loadWeenie(classId);
	});

	async function loadWeenie(id: number) {
		isLoading = true;
		error = null;
		try {
			weenie = await getWeenie(id);
			if (!weenie) {
				error = 'Weenie not found';
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load weenie';
			weenie = null;
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="detail-container">
	{#if isLoading}
		<p class="loading">Loading weenie details...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else if weenie}
		<div class="weenie-card">
			{#if weenie.icon_id}
				<img
					src={buildIconUrl(weenie.icon_id, weenie.icon_overlay, weenie.icon_overlay2, weenie.icon_underlay)}
					alt={weenie.name ?? weenie.class_Name}
					class="weenie-icon"
				/>
			{/if}
			<div class="weenie-info">
				<h2>{weenie.name ?? weenie.class_Name}</h2>
				<dl>
					<dt>Class ID</dt>
					<dd>{weenie.class_Id}</dd>
					<dt>Class Name</dt>
					<dd>{weenie.class_Name}</dd>
					<dt>Type</dt>
					<dd>{weenie.type}</dd>
					{#if weenie.icon_id}
						<dt>Icon ID</dt>
						<dd>{weenie.icon_id}</dd>
						<dt>Icon URL</dt>
						<dd><a href={buildIconUrl(weenie.icon_id, weenie.icon_overlay, weenie.icon_overlay2, weenie.icon_underlay)} target="_blank" rel="noopener">View icon</a></dd>
					{/if}
				</dl>
			</div>
		</div>

		{#if weenie.icon_id}
			<div class="icon-breakdown">
				<h3>Icon Breakdown</h3>
				<div class="breakdown-row">
					{#if weenie.icon_underlay}
						<div class="breakdown-item">
							<img src="https://dats.treestats.net/icons/{weenie.icon_underlay}?scale=2" alt="underlay" />
							<span class="label">underlay</span>
						</div>
						<span class="plus">+</span>
					{/if}
					<div class="breakdown-item">
						<img src="https://dats.treestats.net/icons/{weenie.icon_id}?scale=2" alt="icon" />
						<span class="label">icon</span>
					</div>
					{#if weenie.icon_overlay}
						<span class="plus">+</span>
						<div class="breakdown-item">
							<img src="https://dats.treestats.net/icons/{weenie.icon_overlay}?scale=2" alt="overlay" />
							<span class="label">overlay</span>
						</div>
					{/if}
					{#if weenie.icon_overlay2}
						<span class="plus">+</span>
						<div class="breakdown-item">
							<img src="https://dats.treestats.net/icons/{weenie.icon_overlay2}?scale=2" alt="overlay2" />
							<span class="label">overlay2</span>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	.detail-container {
		margin-top: 24px;
	}

	.loading,
	.error {
		color: #888;
		font-style: italic;
	}

	.error {
		color: #c00;
	}

	.weenie-card {
		display: flex;
		gap: 20px;
		padding: 20px;
		background: #f9f9f9;
		border: 1px solid #ddd;
		border-radius: 8px;
	}

	.weenie-icon {
		width: 64px;
		height: 64px;
		image-rendering: pixelated;
		flex-shrink: 0;
	}

	.weenie-info h2 {
		margin: 0 0 12px;
		font-size: 20px;
	}

	.weenie-info dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 4px 16px;
		margin: 0;
	}

	.weenie-info dt {
		font-weight: 600;
		color: #666;
	}

	.weenie-info dd {
		margin: 0;
	}

	.weenie-info a {
		color: #0066cc;
		text-decoration: none;
	}

	.weenie-info a:hover {
		text-decoration: underline;
	}

	.icon-breakdown {
		margin-top: 20px;
		padding: 16px;
		background: #f0f0f0;
		border-radius: 8px;
	}

	.icon-breakdown h3 {
		margin: 0 0 12px;
		font-size: 14px;
		color: #666;
	}

	.breakdown-row {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}

	.breakdown-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.breakdown-item img {
		width: 64px;
		height: 64px;
		image-rendering: pixelated;
		background: #fff;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	.breakdown-item .label {
		font-size: 11px;
		color: #888;
	}

	.plus {
		font-size: 24px;
		font-weight: 300;
		color: #999;
	}
</style>
