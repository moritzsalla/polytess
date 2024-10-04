import React, { useEffect, useRef } from "react";
import Delaunator from "delaunator";
import type { View } from "./App";

export type Points = Array<[number, number]>;

type SvgCanvasProps = {
	points: Points;
	view: View;
	onClick?: React.SVGProps<SVGSVGElement>["onClick"];
	onDrag?: React.SVGProps<SVGSVGElement>["onPointerMove"];
};

const SvgCanvas = ({ view, points, onClick, onDrag }: SvgCanvasProps) => {
	const svgRef = useRef<React.ElementRef<"svg">>(null);

	useEffect(() => {
		const svgElem = svgRef.current;

		if (!svgElem) {
			console.warn("SVG element not found.");
			return;
		}

		switch (view) {
			case "plain":
				generatePlainView(points, svgElem);
				break;
			case "color":
				generateColorView(points, svgElem);
				break;
			default:
				generatePlainView(points, svgElem);
		}
	}, [points, view]);

	return (
		// SVG content will be rendered here outside of React.
		<svg
			ref={svgRef}
			width='100vw'
			height='100vh'
			onClick={onClick}
			onPointerMove={(e) => {
				// Only if mouse button is pressed
				if (e.buttons === 1 && onDrag) {
					onDrag(e);
				}
			}}
		/>
	);
};

const generatePlainView = (points: Points, svg: React.ElementRef<"svg">) => {
	if (!points.length) return;

	// Create Delaunator object
	const delaunay = new Delaunator(points.flat());

	// Clear previous content
	if (svg) {
		svg.innerHTML = "";
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
		polygon.setAttribute("stroke", "currentcolor");

		svg.appendChild(polygon);
	}
};

// TODO
const generateColorView = (points: Points, svg: React.ElementRef<"svg">) => {
	if (!points.length) return;

	// Create Delaunator object
	const delaunay = new Delaunator(points.flat());

	// Clear previous content
	if (svg) {
		svg.innerHTML = "";
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
		polygon.setAttribute("stroke", "currentcolor");

		svg.appendChild(polygon);
	}
};

export default SvgCanvas;
