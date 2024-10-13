import type Delaunator from "delaunator";
import type { CanvasState } from "../../../store/canvasSlice";
import { linesRenderer } from "./linesRenderer";
import { vertexRenderer } from "./vertexRenderer";
import { gradientRenderer } from "./gradientRenderer";

export type Point = [x: number, y: number];
export type Points = Array<Point>;

export type ViewRenderer = (
	svgElem: SVGGElement,
	delaunay: Delaunator<number[]>,
	canvas: CanvasState,
) => void;

type ViewRenderers = {
	[key: string]: ViewRenderer;
};

const VIEW_RENDERERS = {
	lines: linesRenderer,
	vertex: vertexRenderer,
	gradient: gradientRenderer,
} as const satisfies ViewRenderers;

export type View = keyof typeof VIEW_RENDERERS;

export const VIEWS = Object.keys(VIEW_RENDERERS) as Array<View>;

export const generateView = (
	svgElem: SVGGElement,
	delaunay: Delaunator<number[]>,
	canvas: CanvasState,
) => {
	// Clear the SVG element
	svgElem.innerHTML = "";

	// Call the appropriate renderer
	const renderer = VIEW_RENDERERS[canvas.view];
	if (!renderer) {
		throw new Error(`Unknown view: ${canvas.view}`);
	}

	renderer(svgElem, delaunay, canvas);
};
