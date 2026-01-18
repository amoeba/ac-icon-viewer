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
		background: linear-gradient(145deg, #fffffe 0%, #f8f6f2 100%);
		border: 1px solid #d8d4cc;
		border-radius: 8px;
		overflow: hidden;
		box-shadow:
			0 1px 3px rgba(139, 115, 85, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
	}

	.placeholder {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			#ebe8e2 0%,
			#f8f6f2 50%,
			#ebe8e2 100%
		);
		background-size: 200% 200%;
		animation: shimmer 1.8s ease-in-out infinite;
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
		background: linear-gradient(145deg, #faf9f7 0%, #f0eeea 100%);
		color: #c9a227;
		font-size: 24px;
		font-weight: 300;
	}

	img {
		display: block;
		width: 100%;
		height: 100%;
		image-rendering: pixelated;
		opacity: 0;
		transition: opacity 0.25s ease-out;
	}

	img.loaded {
		opacity: 1;
	}
</style>
