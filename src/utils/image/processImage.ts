import { imageToCanvas } from "./imageToCanvas";
import { detectEdges } from "./detectEdges";
import { edgesToPoints } from "./edgesToPoints";
import type { Points } from "../../components/SvgCanvas/renderers";

export type ProcessImageOptions = {
	edgeThreshold: number;
	pointThreshold: number;
	stepSize: number;
	maxPoints: number;
};

export const processImage = (
	img: HTMLImageElement,
	options: ProcessImageOptions = {
		edgeThreshold: 128,
		pointThreshold: 200,
		stepSize: 5,
		maxPoints: 1000,
	},
): Points => {
	const canvas = imageToCanvas(img);
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Failed to get canvas context");

	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const edges = detectEdges(imageData, { threshold: options.edgeThreshold });
	return edgesToPoints(edges, canvas.width, canvas.height, {
		threshold: options.pointThreshold,
		stepSize: options.stepSize,
		maxPoints: options.maxPoints,
	});
};
