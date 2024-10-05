import React, { forwardRef, useEffect, useRef } from "react";
import Delaunator from "delaunator";
import type { View } from "../config";
import { generateView } from "./utils";

export type Points = Array<[number, number]>;

type SvgCanvasProps = {
	points: Points;
	view: View;
	onClick?: React.SVGProps<SVGSVGElement>["onClick"];
	onDrag?: React.SVGProps<SVGSVGElement>["onPointerMove"];
};

const mergeRefs =
	<T extends any>(
		...refs: Array<React.Ref<T> | undefined>
	): React.RefCallback<T> =>
	(value) => {
		refs.forEach((ref) => {
			if (typeof ref === "function") {
				ref(value);
			} else if (ref) {
				(ref as React.MutableRefObject<T | null>).current = value;
			}
		});
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
