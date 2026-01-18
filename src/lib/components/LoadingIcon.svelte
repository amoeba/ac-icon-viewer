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
		background: linear-gradient(145deg, #ffffff 0%, #f8f8f8 100%);
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		overflow: hidden;
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
	}

	.placeholder {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			#f0f0f0 0%,
			#fafafa 50%,
			#f0f0f0 100%
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
		background: linear-gradient(145deg, #fafafa 0%, #f0f0f0 100%);
		color: #bbb;
		font-size: 24px;
		font-weight: 300;
	}

	img {
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
