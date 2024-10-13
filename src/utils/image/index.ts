import type { Points } from "../../components/SvgCanvas/renderers";
import { loadImage } from "./loadImage";
import { processImage, type ProcessImageOptions } from "./processImage";

export { loadImage } from "./loadImage";
export { processImage } from "./processImage";

export const loadAndProcessImage = async (
	file: File,
	options: ProcessImageOptions = {
		edgeThreshold: 128,
		pointThreshold: 200,
		stepSize: 5,
		maxPoints: 1000,
	},
): Promise<Points> => {
	const img = await loadImage(file);
	return processImage(img, options);
};
