import type { ViewRenderer } from ".";

export const dotRenderer: ViewRenderer = (
	svgElem,
	delaunayTriangles,
	canvas,
) => {
	const { points } = canvas;

	// Create shapes
	for (let i = 0; i < delaunayTriangles.length; i += 3) {
		const p1 = delaunayTriangles[i];
		const p2 = delaunayTriangles[i + 1];
		const p3 = delaunayTriangles[i + 2];

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

		svgElem.appendChild(circle);
	}
};
