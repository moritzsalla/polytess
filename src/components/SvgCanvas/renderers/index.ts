import type Delaunator from "delaunator";
import type { CanvasState } from "../../../store/canvasSlice";
import { lineRenderer } from "./lineRenderer";
import { dotRenderer } from "./dotRenderer";
import { gradientRenderer } from "./gradientRenderer";

export type Point = [x: number, y: number];
export type Points = Array<Point>;

const VIEW_RENDERERS = {
	lines: lineRenderer,
	dots: dotRenderer,
	gradient: gradientRenderer,
} as const satisfies ViewRenderers;

export const VIEWS = Object.keys(VIEW_RENDERERS) as Array<View>;

export type ViewRenderer = (
	svgElem: SVGGElement,
	delaunay: Delaunator<number[]>,
	canvas: CanvasState,
) => void;

type ViewRenderers = {
	[key: string]: ViewRenderer;
};

export type View = keyof typeof VIEW_RENDERERS;

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
