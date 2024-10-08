import type Delaunator from "delaunator";
import type { Points } from "./SvgCanvas";
import type { View } from "../../config";

type Renderer = (
	points: Points,
	delaunay: Delaunator<number[]>,
	svg: SVGElement,
) => void;

const SHAPE_RENDERING = "auto";

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

		// Improve AA
		polygon.setAttribute("shape-rendering", SHAPE_RENDERING);

		polygon.setAttribute(
			"points",
			`${points[p1][0]},${points[p1][1]} ${points[p2][0]},${points[p2][1]} ${points[p3][0]},${points[p3][1]}`,
		);
		polygon.setAttribute("fill", "none");
		polygon.setAttribute("stroke", "currentcolor");

		svg.appendChild(polygon);
	}
};

const renderVertexView: Renderer = (points, delaunay, svg) => {
	// Create shapes
	for (let i = 0; i < delaunay.triangles.length; i += 3) {
		const p1 = delaunay.triangles[i];
		const p2 = delaunay.triangles[i + 1];
		const p3 = delaunay.triangles[i + 2];

		// Calculate center point of triangle
		const centerX = (points[p1][0] + points[p2][0] + points[p3][0]) / 3;
		const centerY = (points[p1][1] + points[p2][1] + points[p3][1]) / 3;

		// Create ellipse instead of polygon
		const circle = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"circle",
		);

		circle.setAttribute("cx", centerX.toString());
		circle.setAttribute("cy", centerY.toString());
		circle.setAttribute("r", "1");

		// Randomly select color from palette
		circle.setAttribute("fill", "currentColor");

		svg.appendChild(circle);
	}
};

const renderGradientView: Renderer = (points, delaunay, svg) => {
	// Create a <defs> section if it doesn't exist
	let defs = svg.querySelector("defs");
	if (!defs) {
		defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
		svg.appendChild(defs);
	}

	// Draw triangles
	for (let i = 0; i < delaunay.triangles.length; i += 3) {
		const p1 = delaunay.triangles[i];
		const p2 = delaunay.triangles[i + 1];
		const p3 = delaunay.triangles[i + 2];

		const polygon = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"polygon",
		);

		// Improve AA
		polygon.setAttribute("shape-rendering", SHAPE_RENDERING);

		polygon.setAttribute(
			"points",
			`${points[p1][0]},${points[p1][1]} ${points[p2][0]},${points[p2][1]} ${points[p3][0]},${points[p3][1]}`,
		);

		// Create a unique ID for each gradient
		const gradientId = `gradient-${i}`;

		// Create a linear gradient
		const gradient = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"linearGradient",
		);
		gradient.setAttribute("id", gradientId);
		gradient.setAttribute("x1", "0%");
		gradient.setAttribute("y1", "0%");
		gradient.setAttribute("x2", "100%");
		gradient.setAttribute("y2", "100%");

		// Create gradient stops
		const stops = [
			{ offset: "0%", color: "red" },
			{ offset: "100%", color: "blue" },
		];

		stops.forEach((stop) => {
			const stopElem = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"stop",
			);
			stopElem.setAttribute("offset", stop.offset);
			stopElem.setAttribute("stop-color", stop.color);
			gradient.appendChild(stopElem);
		});

		// Add the gradient to the <defs> section
		defs.appendChild(gradient);

		// Set the fill of the polygon to use the gradient
		polygon.setAttribute("fill", `url(#${gradientId})`);

		svg.appendChild(polygon);
	}
};

const VIEW_RENDERERS: {
	[K in View]: Renderer;
} = {
	lines: renderLinesView,
	vertex: renderVertexView,
	gradient: renderGradientView,
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
	renderer(points, delaunay, svgElem);
};
