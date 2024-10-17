import type { ViewRenderer } from ".";

export const dotRenderer: ViewRenderer = (svgElem, delaunay, canvas) => {
	const { points } = canvas;

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

		svgElem.appendChild(circle);
	}
};
