import type { CanvasState } from "../../../store/canvasSlice";
import { lineRenderer } from "./lineRenderer";
import { dotRenderer } from "./dotRenderer";
import { gradientRenderer } from "./gradientRenderer";
import type { WorkerResponse } from "../../../hooks/useDelaunayWorker/delaunayWorker";

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
	delaunayTriangles: WorkerResponse,
	canvas: CanvasState,
) => void;

type ViewRenderers = {
	[key: string]: ViewRenderer;
};

export type View = keyof typeof VIEW_RENDERERS;

export const generateView = (
	svgElem: SVGGElement,
	delaunayTriangles: WorkerResponse,
	canvas: CanvasState,
) => {
	// Clear the SVG element
	svgElem.innerHTML = "";

	// Call the appropriate renderer
	const renderer = VIEW_RENDERERS[canvas.view];
	if (!renderer) {
		throw new Error(`Unknown view: ${canvas.view}`);
	}

	// Extra safety checks in case web worker is slow etc.
	if (!delaunayTriangles || delaunayTriangles.length === 0) {
		return;
	}

	try {
		renderer(svgElem, delaunayTriangles, canvas);
	} catch (error) {
		console.error("Failed rendering attempt.", { error, delaunayTriangles });
	}
};
