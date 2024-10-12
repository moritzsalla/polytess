import type { ViewRenderer } from ".";
import { calculateBoundingBox } from "../../../utils/svg";

export const patternRenderer: ViewRenderer = (svgElem, delaunay, canvas) => {
	const { points } = canvas;

	// Create defs element if it doesn't exist
	let defs = svgElem.querySelector("defs");
	if (!defs) {
		defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
		svgElem.insertBefore(defs, svgElem.firstChild);
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

		svgElem.appendChild(polygon);
	}
};
