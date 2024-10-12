import type Delaunator from "delaunator";
import type { View } from "../../../config/views";
import { linesRenderer } from "./linesRenderer";
import { vertexRenderer } from "./vertexRenderer";
import { gradientRenderer } from "./gradientRenderer";
import { patternRenderer } from "./patternRenderer";
import { imageRenderer } from "./imageRenderer";

export type Points = Array<[number, number]>;

export type ViewRenderer = (
	points: Points,
	delaunay: Delaunator<number[]>,
	svgElem: SVGElement,
) => void;

type ViewRenderers = {
	[K in View]: ViewRenderer;
};

const VIEW_RENDERERS: ViewRenderers = {
	lines: linesRenderer,
	vertex: vertexRenderer,
	gradient: gradientRenderer,
	pattern: patternRenderer,
	image: imageRenderer,
};

export const generateView = (
	view: View,
	svgElem: SVGGElement,
	points: Points,
	delaunay: Delaunator<number[]>,
) => {
	// Clear the SVG element
	svgElem.innerHTML = "";

	// Call the appropriate renderer
	const renderer = VIEW_RENDERERS[view];
	if (!renderer) {
		throw new Error(`Unknown view: ${view}`);
	}

	renderer(points, delaunay, svgElem);
};
