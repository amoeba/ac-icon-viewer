<script lang="ts">
	interface Props {
		src: string;
		alt: string;
		size?: number;
	}

	let { src, alt, size = 64 }: Props = $props();

	let loaded = $state(false);
	let error = $state(false);

	function handleLoad() {
		loaded = true;
	}

	function handleError() {
		error = true;
	}

	$effect(() => {
		// Reset state when src changes
		src;
		loaded = false;
		error = false;
	});
</script>

<div class="icon-wrapper" style="width: {size}px; height: {size}px;">
	{#if !loaded && !error}
		<div class="placeholder"></div>
	{/if}
	{#if error}
		<div class="error-icon">?</div>
	{:else}
		<img
			{src}
			{alt}
			class:loaded
			onload={handleLoad}
			onerror={handleError}
		/>
	{/if}
</div>

<style>
	.icon-wrapper {
		position: relative;
		flex-shrink: 0;
		background: #fff;
		border: 1px solid #ddd;
		border-radius: 4px;
		overflow: hidden;
	}

	.placeholder {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
		background-size: 200% 200%;
		animation: shimmer 1.5s ease-in-out infinite;
		border-radius: 4px;
	}

	@keyframes shimmer {
		0% {
			background-position: 100% 100%;
		}
		100% {
			background-position: 0% 0%;
		}
	}

	.error-icon {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f5f5f5;
		border: 1px solid #ddd;
		border-radius: 4px;
		color: #999;
		font-size: 24px;
	}

	img {
		width: 100%;
		height: 100%;
		image-rendering: pixelated;
		opacity: 0;
		transition: opacity 0.2s ease-in;
	}

	img.loaded {
		opacity: 1;
	}
</style>
