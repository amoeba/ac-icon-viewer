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
</style>
