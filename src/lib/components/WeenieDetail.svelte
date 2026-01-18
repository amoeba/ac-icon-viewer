<script lang="ts">
	import { getWeenie, buildIconUrl, getItemTypeName, getItemTypeBackgroundId, type WeenieDetail } from '$lib/api/acedb';
	import LoadingIcon from './LoadingIcon.svelte';

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
				<LoadingIcon
					src={buildIconUrl(weenie.icon_id, weenie.icon_overlay, weenie.icon_overlay2, weenie.icon_underlay, weenie.item_type)}
					alt={weenie.name ?? weenie.class_Name}
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
					{#if weenie.item_type != null}
						<dt>Item Type</dt>
						<dd>{weenie.item_type} ({getItemTypeName(weenie.item_type) ?? 'unknown'})</dd>
					{/if}
					{#if weenie.icon_id}
						<dt>Icon ID</dt>
						<dd>{weenie.icon_id}</dd>
						<dt>Icon URL</dt>
						<dd><a href={buildIconUrl(weenie.icon_id, weenie.icon_overlay, weenie.icon_overlay2, weenie.icon_underlay, weenie.item_type)} target="_blank" rel="noopener">View icon</a></dd>
					{/if}
				</dl>
			</div>
		</div>

		{#if weenie.icon_id}
			<div class="apothecary-table">
				<div class="table-corner top-left"></div>
				<div class="table-corner top-right"></div>
				<div class="table-corner bottom-left"></div>
				<div class="table-corner bottom-right"></div>
				<div class="table-edge top"></div>
				<div class="table-edge bottom"></div>
				<div class="table-edge left"></div>
				<div class="table-edge right"></div>

				<h3 class="table-header">
					<span class="flourish left"></span>
					Icon Composition
					<span class="flourish right"></span>
				</h3>

				<div class="ingredient-shelf">
					{#if weenie.item_type != null}
						{@const backgroundId = getItemTypeBackgroundId(weenie.item_type)}
						{#if backgroundId}
							<div class="ingredient-slot">
								<div class="ingredient-glow"></div>
								<LoadingIcon src="https://dats.treestats.net/icons/{backgroundId}?scale=2" alt="background" />
								<span class="ingredient-tag">background</span>
							</div>
							<span class="alchemical-symbol">+</span>
						{/if}
					{/if}
					{#if weenie.icon_underlay}
						<div class="ingredient-slot">
							<div class="ingredient-glow"></div>
							<LoadingIcon src="https://dats.treestats.net/icons/{weenie.icon_underlay}?scale=2" alt="underlay" />
							<span class="ingredient-tag">underlay</span>
						</div>
						<span class="alchemical-symbol">+</span>
					{/if}
					<div class="ingredient-slot primary">
						<div class="ingredient-glow"></div>
						<LoadingIcon src="https://dats.treestats.net/icons/{weenie.icon_id}?scale=2" alt="icon" />
						<span class="ingredient-tag">icon</span>
					</div>
					{#if weenie.icon_overlay}
						<span class="alchemical-symbol">+</span>
						<div class="ingredient-slot">
							<div class="ingredient-glow"></div>
							<LoadingIcon src="https://dats.treestats.net/icons/{weenie.icon_overlay}?scale=2" alt="overlay" />
							<span class="ingredient-tag">overlay</span>
						</div>
					{/if}
					{#if weenie.icon_overlay2}
						<span class="alchemical-symbol">+</span>
						<div class="ingredient-slot">
							<div class="ingredient-glow"></div>
							<LoadingIcon src="https://dats.treestats.net/icons/{weenie.icon_overlay2}?scale=2" alt="overlay2" />
							<span class="ingredient-tag">overlay2</span>
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
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.loading,
	.error {
		color: #8b7355;
		font-style: italic;
	}

	.error {
		color: #8b2635;
	}

	.weenie-card {
		display: flex;
		gap: 20px;
		padding: 20px;
		background: linear-gradient(145deg, #fafaf8 0%, #f0eeea 100%);
		border: 1px solid #d8d4cc;
		border-left: 3px solid #c9a227;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(139, 115, 85, 0.08);
	}

	.weenie-info h2 {
		margin: 0 0 12px;
		font-size: 20px;
		color: #3a3530;
	}

	.weenie-info dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 6px 16px;
		margin: 0;
		font-size: 14px;
	}

	.weenie-info dt {
		font-weight: 600;
		color: #8b7355;
	}

	.weenie-info dd {
		margin: 0;
		color: #4a4540;
	}

	.weenie-info a {
		color: #2c4a7c;
		text-decoration: none;
	}

	.weenie-info a:hover {
		color: #8b2635;
		text-decoration: underline;
	}

	/* Apothecary Table */
	.apothecary-table {
		position: relative;
		padding: 28px 24px 24px;
		background:
			repeating-linear-gradient(
				90deg,
				transparent 0px,
				transparent 48px,
				rgba(0, 0, 0, 0.03) 48px,
				rgba(0, 0, 0, 0.03) 50px
			),
			linear-gradient(
				180deg,
				#4a3728 0%,
				#3d2e22 15%,
				#352618 50%,
				#2d1f14 85%,
				#241810 100%
			);
		border-radius: 4px;
		box-shadow:
			inset 0 2px 4px rgba(255, 220, 150, 0.1),
			inset 0 -3px 6px rgba(0, 0, 0, 0.4),
			0 4px 12px rgba(0, 0, 0, 0.5),
			0 8px 24px rgba(0, 0, 0, 0.3);
	}

	/* Brass corner ornaments */
	.table-corner {
		position: absolute;
		width: 20px;
		height: 20px;
		background: linear-gradient(135deg, #d4a84b 0%, #8b6914 50%, #d4a84b 100%);
		border-radius: 2px;
		box-shadow:
			inset 0 1px 2px rgba(255, 255, 255, 0.4),
			0 2px 4px rgba(0, 0, 0, 0.4);
	}

	.table-corner::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 8px;
		height: 8px;
		background: radial-gradient(circle, #f0d890 0%, #a67c00 100%);
		border-radius: 50%;
		box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5);
	}

	.table-corner.top-left { top: 6px; left: 6px; }
	.table-corner.top-right { top: 6px; right: 6px; }
	.table-corner.bottom-left { bottom: 6px; left: 6px; }
	.table-corner.bottom-right { bottom: 6px; right: 6px; }

	/* Brass edge trim */
	.table-edge {
		position: absolute;
		background: linear-gradient(90deg, #8b6914 0%, #d4a84b 50%, #8b6914 100%);
	}

	.table-edge.top, .table-edge.bottom {
		left: 32px;
		right: 32px;
		height: 2px;
	}

	.table-edge.top { top: 14px; }
	.table-edge.bottom { bottom: 14px; }

	.table-edge.left, .table-edge.right {
		top: 32px;
		bottom: 32px;
		width: 2px;
	}

	.table-edge.left { left: 14px; }
	.table-edge.right { right: 14px; }

	/* Header with flourishes */
	.table-header {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		margin: 0 0 20px;
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 14px;
		font-weight: 400;
		font-style: italic;
		color: #d4a84b;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
		letter-spacing: 2px;
		text-transform: uppercase;
	}

	.flourish {
		display: inline-block;
		width: 40px;
		height: 1px;
		background: linear-gradient(90deg, transparent 0%, #d4a84b 50%, transparent 100%);
	}

	.flourish.left::before,
	.flourish.right::before {
		content: '\2022';
		position: relative;
		color: #d4a84b;
		font-size: 8px;
	}

	.flourish.left::before { left: -4px; }
	.flourish.right::before { left: calc(100% - 4px); }

	/* Ingredient shelf */
	.ingredient-shelf {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		flex-wrap: wrap;
		padding: 16px;
		background:
			linear-gradient(
				0deg,
				rgba(0, 0, 0, 0.3) 0%,
				rgba(0, 0, 0, 0.1) 30%,
				transparent 100%
			),
			linear-gradient(
				180deg,
				#2a1e15 0%,
				#3a2a1d 100%
			);
		border-radius: 4px;
		box-shadow:
			inset 0 2px 8px rgba(0, 0, 0, 0.5),
			inset 0 -1px 2px rgba(255, 220, 150, 0.05);
	}

	/* Individual ingredient slots */
	.ingredient-slot {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 12px;
		background:
			radial-gradient(
				ellipse at center bottom,
				rgba(0, 0, 0, 0.4) 0%,
				transparent 70%
			),
			linear-gradient(
				180deg,
				#2d2218 0%,
				#1f1610 100%
			);
		border: 1px solid #4a3828;
		border-radius: 6px;
		box-shadow:
			inset 0 1px 1px rgba(255, 220, 150, 0.05),
			0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.ingredient-slot.primary {
		border-color: #6b5030;
		box-shadow:
			inset 0 1px 1px rgba(255, 220, 150, 0.08),
			0 0 12px rgba(212, 168, 75, 0.15),
			0 2px 4px rgba(0, 0, 0, 0.3);
	}

	/* Magical glow under ingredients */
	.ingredient-glow {
		position: absolute;
		top: 8px;
		left: 50%;
		transform: translateX(-50%);
		width: 50px;
		height: 50px;
		background: radial-gradient(
			circle,
			rgba(100, 180, 255, 0.15) 0%,
			rgba(100, 180, 255, 0.05) 40%,
			transparent 70%
		);
		border-radius: 50%;
		pointer-events: none;
	}

	.ingredient-slot.primary .ingredient-glow {
		background: radial-gradient(
			circle,
			rgba(212, 168, 75, 0.2) 0%,
			rgba(212, 168, 75, 0.08) 40%,
			transparent 70%
		);
	}

	/* Parchment-style labels */
	.ingredient-tag {
		padding: 3px 10px;
		background:
			linear-gradient(
				180deg,
				#e8dcc4 0%,
				#d4c4a8 50%,
				#c8b898 100%
			);
		border-radius: 2px;
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 10px;
		font-style: italic;
		color: #4a3828;
		text-transform: lowercase;
		letter-spacing: 0.5px;
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.3),
			inset 0 1px 1px rgba(255, 255, 255, 0.5);
	}

	/* Alchemical connector symbols */
	.alchemical-symbol {
		font-size: 42px;
		font-weight: 700;
		color: #d4a84b;
		text-shadow: 0 0 8px rgba(212, 168, 75, 0.4);
		line-height: 1;
		opacity: 0.65;
	}
</style>
