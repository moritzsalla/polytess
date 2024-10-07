import css from "./SvgCanvas.module.css";
import React, { forwardRef, useEffect, useRef } from "react";

import type { Mode, View } from "../../config";
import { generateView } from "./utils";

import SvgCanvasCustomCursor from "./SvgCanvasCustomCursor";
import { mergeRefs } from "../../utils";
import Delaunator from "../../lib/delaunator";

export type Points = Array<[number, number]>;
export type OnClickFn = React.SVGProps<SVGSVGElement>["onClick"];
export type OnDragFn = React.SVGProps<SVGSVGElement>["onPointerMove"];

type SvgCanvasProps = {
	points: Points;
	view: View;
	mode: Mode;
	onClick?: OnClickFn;
	onDrag?: OnDragFn;
};

const SvgCanvas = forwardRef<SVGSVGElement, SvgCanvasProps>(
	({ view, points, mode, onClick, onDrag }, forwardedRef) => {
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
			<>
				<svg
					ref={mergeRefs(svgRef, forwardedRef)}
					className={css.root}
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
				<SvgCanvasCustomCursor mode={mode} svgRef={svgRef} />
			</>
		);
	},
);

export default SvgCanvas;
