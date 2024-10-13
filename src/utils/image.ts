import type { Points } from "../components/SvgCanvas/renderers";

export const loadAndProcessImage = async (file: File): Promise<Points> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				const img = new Image();

				img.onload = () => {
					canvas.width = img.width;
					canvas.height = img.height;
					ctx?.drawImage(img, 0, 0);

					const imageData = ctx?.getImageData(
						0,
						0,
						canvas.width,
						canvas.height,
					);
					if (!imageData) throw new Error("Failed to read image data.");

					const edges = detectEdges(
						imageData.data,
						canvas.width,
						canvas.height,
					);

					const points = edgesToPoints(edges, canvas.width, canvas.height);
					resolve(points);
				};

				img.onerror = () => reject(new Error("Failed to load image"));
				img.src = reader.result as string;
			} catch (error) {
				reject(error);
			}
		};
		reader.onerror = () => reject(new Error("Failed to read file"));
		reader.readAsDataURL(file);
	});
};

export const detectEdges = (
	pixels: Uint8ClampedArray,
	width: number,
	height: number,
): Uint8ClampedArray => {
	const grayscale = new Uint8ClampedArray(width * height);
	const edges = new Uint8ClampedArray(width * height * 4);

	// Convert to grayscale
	for (let i = 0; i < pixels.length; i += 4) {
		const r = pixels[i];
		const g = pixels[i + 1];
		const b = pixels[i + 2];
		grayscale[i / 4] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
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
			edges[edgeIdx] =
				edges[edgeIdx + 1] =
				edges[edgeIdx + 2] =
					magnitude > 128 ? 255 : 0;
			edges[edgeIdx + 3] = 255; // Alpha channel
		}
	}

	return edges;
};

const edgesToPoints = (
	edges: Uint8ClampedArray,
	width: number,
	height: number,
): Points => {
	const points: Points = [];
	const threshold = 200; // Adjust this value to change sensitivity
	const stepSize = 5; // Adjust this value to change the density of points

	for (let y = 0; y < height; y += stepSize) {
		for (let x = 0; x < width; x += stepSize) {
			const idx = (y * width + x) * 4;
			if (edges[idx] > threshold) {
				points.push([x, y]);
			}
		}
	}

	return points;
};
