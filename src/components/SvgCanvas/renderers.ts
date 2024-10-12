import type Delaunator from "delaunator";
import { calculateBoundingBox } from "../../utils/svg";
import type { View } from "../../config/views";

export type Points = Array<[number, number]>;

type Renderer = (
	points: Points,
	delaunay: Delaunator<number[]>,
	svg: SVGElement,
) => void;

const lines: Renderer = (points, delaunay, svg) => {
	// Draw triangles
	for (let i = 0; i < delaunay.triangles.length; i += 3) {
		const p1 = delaunay.triangles[i];
		const p2 = delaunay.triangles[i + 1];
		const p3 = delaunay.triangles[i + 2];

		const polygon = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"polygon",
		);

		polygon.setAttribute("shape-rendering", "auto");
		polygon.setAttribute(
			"points",
			`${points[p1][0]},${points[p1][1]} ${points[p2][0]},${points[p2][1]} ${points[p3][0]},${points[p3][1]}`,
		);
		polygon.setAttribute("fill", "none");
		polygon.setAttribute("stroke", "currentcolor");

		svg.appendChild(polygon);
	}
};

const vertex: Renderer = (points, delaunay, svg) => {
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

const gradient: Renderer = (points, delaunay, svg) => {
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
		polygon.setAttribute("shape-rendering", "auto");
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

const pattern: Renderer = (points, delaunay, svg) => {
	// Create defs element if it doesn't exist
	let defs = svg.querySelector("defs");
	if (!defs) {
		defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
		svg.insertBefore(defs, svg.firstChild);
	}

	// Create shapes
	for (let i = 0; i < delaunay.triangles.length; i += 3) {
		const p1 = delaunay.triangles[i];
		const p2 = delaunay.triangles[i + 1];
		const p3 = delaunay.triangles[i + 2];

		// Create a unique pattern for this polygon
		const patternId = `image-pattern-${i}`;
		const pattern = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"pattern",
		);
		pattern.setAttribute("id", patternId);
		pattern.setAttribute("patternUnits", "userSpaceOnUse");
		pattern.setAttribute("width", "100%");
		pattern.setAttribute("height", "100%");

		// Create image element
		const image = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"image",
		);
		image.setAttribute("href", "/gradient.png");
		image.setAttribute("width", "100%");
		image.setAttribute("height", "100%");
		image.setAttribute("preserveAspectRatio", "xMidYMid slice");

		// Append image to pattern, and pattern to defs
		pattern.appendChild(image);
		defs.appendChild(pattern);

		// Create polygon
		const polygon = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"polygon",
		);

		const pointsAttr = `${points[p1][0]},${points[p1][1]} ${points[p2][0]},${points[p2][1]} ${points[p3][0]},${points[p3][1]}`;
		polygon.setAttribute("points", pointsAttr);

		// Set fill to use this specific image pattern
		polygon.setAttribute("fill", `url(#${patternId})`);

		// Set the pattern's viewBox to match the polygon's bounding box
		const [minX, minY, width, height] = calculateBoundingBox(
			points[p1],
			points[p2],
			points[p3],
		);
		pattern.setAttribute("viewBox", `${minX} ${minY} ${width} ${height}`);

		svg.appendChild(polygon);
	}
};

const image: Renderer = () => {};

const VIEW_RENDERERS: {
	[K in View]: Renderer;
} = {
	lines,
	vertex,
	gradient,
	pattern,
	image,
};

export const generateView = (
	view: View,
	svgElem: SVGGElement,
	points: Points,
	delaunay: Delaunator<number[]>,
) => {
	svgElem.innerHTML = ""; // Clear the SVG element

	const renderer = VIEW_RENDERERS[view]; // Call the appropriate renderer
	if (!renderer) {
		throw new Error(`Unknown view: ${view}`);
	}
	renderer(points, delaunay, svgElem);
};
