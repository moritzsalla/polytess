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

const renderShapesView: Renderer = (points, delaunay, svg) => {
	// Create a defs element to hold our patterns
	const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
	svg.appendChild(defs);

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

		// Create a unique pattern for this polygon
		const patternId = `imagePattern${i}`;
		const pattern = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"pattern",
		);
		pattern.setAttribute("id", patternId);
		pattern.setAttribute("patternUnits", "userSpaceOnUse");
		pattern.setAttribute("width", "100%");
		pattern.setAttribute("height", "100%");

		const image = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"image",
		);
		image.setAttribute("href", "logo192.png");
		image.setAttribute("width", "100%");
		image.setAttribute("height", "100%");
		image.setAttribute("preserveAspectRatio", "xMidYMid slice");

		pattern.appendChild(image);
		defs.appendChild(pattern);

		// Use the unique pattern as fill
		polygon.setAttribute("fill", `url(#${patternId})`);

		// You might want to keep the stroke for definition, or remove it
		polygon.setAttribute("stroke", "none");

		svg.appendChild(polygon);
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
	// Clear the SVG element
	svgElem.innerHTML = "";

	// Call the appropriate renderer
	const renderer = VIEW_RENDERERS[view];
	renderer(points, delaunay, svgElem);
};
