import type Delaunator from "delaunator";
import type { Points } from "./SvgCanvas";
import type { View } from "../config";

type Renderer = (
	points: Points,
	delaunay: Delaunator<number[]>,
	svg: SVGElement,
) => void;

const renderLinesView: Renderer = (points, delaunay, svg) => {
	// Draw triangles
	for (let i = 0; i < delaunay.triangles.length; i += 3) {
		const p1 = delaunay.triangles[i];
		const p2 = delaunay.triangles[i + 1];
		const p3 = delaunay.triangles[i + 2];

		const polygon = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"polygon",
		);
		polygon.setAttribute(
			"points",
			`${points[p1][0]},${points[p1][1]} ${points[p2][0]},${points[p2][1]} ${points[p3][0]},${points[p3][1]}`,
		);
		polygon.setAttribute("fill", "none");
		polygon.setAttribute("stroke", "currentcolor");

		svg.appendChild(polygon);
	}
};

const renderShapesView: Renderer = (points, delaunay, svg) => {
	// Draw triangles
	for (let i = 0; i < delaunay.triangles.length; i += 3) {
		const p1 = delaunay.triangles[i];
		const p2 = delaunay.triangles[i + 1];
		const p3 = delaunay.triangles[i + 2];

		const polygon = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"polygon",
		);
		polygon.setAttribute(
			"points",
			`${points[p1][0]},${points[p1][1]} ${points[p2][0]},${points[p2][1]} ${points[p3][0]},${points[p3][1]}`,
		);
		polygon.setAttribute("fill", "black");
		polygon.setAttribute("stroke", "white");

		svg.appendChild(polygon);
	}
};

const renderGradientView: Renderer = (points, delaunay, svg) => {
	// Draw triangles
	for (let i = 0; i < delaunay.triangles.length; i += 3) {
		const p1 = delaunay.triangles[i];
		const p2 = delaunay.triangles[i + 1];
		const p3 = delaunay.triangles[i + 2];

		const polygon = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"polygon",
		);
		polygon.setAttribute(
			"points",
			`${points[p1][0]},${points[p1][1]} ${points[p2][0]},${points[p2][1]} ${points[p3][0]},${points[p3][1]}`,
		);
		polygon.setAttribute(
			"fill",
			`rgb(${points[p1][0]},${points[p1][1]},255)`,
		);
		polygon.setAttribute("stroke", "white");

		svg.appendChild(polygon);
	}
};

const renderImageTraceView: Renderer = (points, delaunay, svg) => {
	throw new Error("Not implemented");
};

const VIEW_RENDERERS: {
	[K in View]: Renderer;
} = {
	lines: renderLinesView,
	shapes: renderShapesView,
	gradient: renderGradientView,
	imageTrace: renderImageTraceView,
};

export const generateView = (
	view: View,
	svgElem: SVGGElement,
	points: Points,
	delaunay: Delaunator<number[]>,
) => {
	svgElem.innerHTML = "";

	const renderer = VIEW_RENDERERS[view];
	renderer(points, delaunay, svgElem);
};
