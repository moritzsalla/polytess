export const detectEdges = (
	imageData: ImageData,
	options = { threshold: 128 },
): Uint8ClampedArray => {
	const { width, height, data } = imageData;
	const grayscale = new Uint8ClampedArray(width * height);
	const edges = new Uint8ClampedArray(width * height * 4);

	// Convert to grayscale
	for (let i = 0; i < data.length; i += 4) {
		grayscale[i / 4] = Math.round(
			0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2],
		);
	}

	// Apply Sobel operator
	for (let y = 1; y < height - 1; y++) {
		for (let x = 1; x < width - 1; x++) {
			const idx = y * width + x;

			const gx =
				grayscale[idx - width - 1] +
				2 * grayscale[idx - 1] +
				grayscale[idx + width - 1] -
				grayscale[idx - width + 1] -
				2 * grayscale[idx + 1] -
				grayscale[idx + width + 1];

			const gy =
				grayscale[idx - width - 1] +
				2 * grayscale[idx - width] +
				grayscale[idx - width + 1] -
				grayscale[idx + width - 1] -
				2 * grayscale[idx + width] -
				grayscale[idx + width + 1];

			const magnitude = Math.sqrt(gx * gx + gy * gy);

			const edgeIdx = idx * 4;
			const edgeValue = magnitude > options.threshold ? 255 : 0;
			edges[edgeIdx] = edges[edgeIdx + 1] = edges[edgeIdx + 2] = edgeValue;
			edges[edgeIdx + 3] = 255; // Alpha channel
		}
	}

	return edges;
};
