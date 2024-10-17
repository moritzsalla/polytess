import type { ViewRenderer } from ".";

export const linesRenderer: ViewRenderer = (svgElem, delaunay, canvas) => {
	const { points } = canvas;

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
			[points[p1], points[p2], points[p3]].flat().join(","),
		);
		polygon.setAttribute("fill", "none");
		polygon.setAttribute("stroke", "currentcolor");

		svgElem.appendChild(polygon);
	}
};
