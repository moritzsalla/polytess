import type { ViewRenderer } from ".";

export const GRADIENT_COLOR_START = "--gradient-start";
export const GRADIENT_COLOR_END = "--gradient-end";

export const gradientRenderer: ViewRenderer = (
	svgElem,
	delaunayTriangles,
	canvas,
) => {
	const { points } = canvas;

	// Create a <defs> section if it doesn't exist
	let defs = svgElem.querySelector("defs");
	if (!defs) {
		defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
		svgElem.appendChild(defs);
	}

	// Draw triangles
	for (let i = 0; i < delaunayTriangles.length; i += 3) {
		const p1 = delaunayTriangles[i];
		const p2 = delaunayTriangles[i + 1];
		const p3 = delaunayTriangles[i + 2];

		const polygon = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"polygon",
		);

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
			{ offset: "0%", color: canvas.gradient.startColor },
			{ offset: "100%", color: canvas.gradient.endColor },
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

		svgElem.appendChild(polygon);
	}
};
