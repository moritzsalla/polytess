import type { ViewRenderer } from ".";

export const lineRenderer: ViewRenderer = (
	svgElem,
	delaunayTriangles,
	canvas,
) => {
	const { points } = canvas;

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
		polygon.setAttribute("fill", "none");
		polygon.setAttribute("stroke", "currentcolor");

		svgElem.appendChild(polygon);
	}
};
