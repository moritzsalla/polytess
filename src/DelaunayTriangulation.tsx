import React, { useEffect, useRef } from "react";
import Delaunator from "delaunator";

const DelaunayTriangulation = ({
	points,
	width,
	height,
}: {
	points: Array<[number, number]>;
	width: number;
	height: number;
}) => {
	const svgRef = useRef<React.ElementRef<"svg">>(null);

	useEffect(() => {
		if (!points.length) return;

		// Create Delaunator object
		const delaunay = new Delaunator(points.flat());

		// Clear previous content
		if (svgRef.current) {
			svgRef.current.innerHTML = "";
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
			polygon.setAttribute(
				"points",
				`${points[p1][0]},${points[p1][1]} ${points[p2][0]},${points[p2][1]} ${points[p3][0]},${points[p3][1]}`,
			);
			polygon.setAttribute("fill", "none");
			polygon.setAttribute("stroke", "black");

			svgRef.current?.appendChild(polygon);
		}
	}, [points]);

	return (
		<svg ref={svgRef} width={width} height={height}>
			{/* SVG content will be rendered here outside of React. */}
		</svg>
	);
};

export default DelaunayTriangulation;
