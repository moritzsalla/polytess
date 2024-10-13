import type { Points } from "../../components/SvgCanvas/renderers";

export const edgesToPoints = (
	edges: Uint8ClampedArray,
	width: number,
	height: number,
	options = { threshold: 200, stepSize: 5, maxPoints: 1000 },
): Points => {
	const points: Points = [];
	const { threshold, stepSize, maxPoints } = options;

	for (let y = 0; y < height; y += stepSize) {
		for (let x = 0; x < width; x += stepSize) {
			const idx = (y * width + x) * 4;
			if (edges[idx] > threshold) {
				points.push([x, y]);
				if (points.length >= maxPoints) {
					return points;
				}
			}
		}
	}

	return points;
};
