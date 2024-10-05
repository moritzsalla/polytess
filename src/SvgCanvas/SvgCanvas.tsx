import React, { forwardRef, useEffect, useRef } from "react";
import Delaunator from "delaunator";
import type { View } from "../config";
import { generateView } from "./utils";
import { mergeRefs } from "../utils";

export type Points = Array<[number, number]>;
export type OnClickFn = React.SVGProps<SVGSVGElement>["onClick"];
export type OnDragFn = React.SVGProps<SVGSVGElement>["onPointerMove"];

type SvgCanvasProps = {
	points: Points;
	view: View;
	onClick?: OnClickFn;
	onDrag?: OnDragFn;
};

const SvgCanvas = forwardRef<SVGSVGElement, SvgCanvasProps>(
	({ view, points, onClick, onDrag }, forwardedRef) => {
		const svgRef = useRef<React.ElementRef<"svg">>(null);

		useEffect(() => {
			const svgElem = svgRef.current;
			if (!svgElem) {
				console.error("SVG element not found");
				return;
			}
			const delaunay = new Delaunator(points.flat());
			generateView(view, svgElem, points, delaunay);
		}, [points, view]);

		return (
			// SVG content will be rendered here outside of React.
			<svg
				ref={mergeRefs(svgRef, forwardedRef)}
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
	},
);

export default SvgCanvas;
