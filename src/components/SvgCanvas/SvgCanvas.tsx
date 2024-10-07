import css from "./SvgCanvas.module.css";
import React, { forwardRef, useEffect, useRef } from "react";
import { generateView } from "./utils";

import SvgCanvasCustomCursor from "./SvgCanvasCustomCursor";
import { mergeRefs } from "../../utils";
import Delaunator from "../../lib/delaunator";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { addPoint, erasePoints } from "../../store/canvasSlice";
import { ERASE_MODE_RADIUS } from "../../config";

export type Points = Array<[number, number]>;
export type OnClickFn = React.SVGProps<SVGSVGElement>["onClick"];
export type OnDragFn = React.SVGProps<SVGSVGElement>["onPointerMove"];

type SvgCanvasProps = {};

const SvgCanvas = forwardRef<SVGSVGElement, SvgCanvasProps>(
	(_, forwardedRef) => {
		const svgRef = useRef<React.ElementRef<"svg">>(null);
		const dispatch = useDispatch();
		const { mode, view, points } = useSelector<
			RootState,
			RootState["canvas"]
		>((state) => state.canvas);

		useEffect(() => {
			const svgElem = svgRef.current;
			if (!svgElem) {
				console.error("SVG element not found");
				return;
			}

			const maxEdgeLength = 100;
			const delaunay = new Delaunator(points.flat(), maxEdgeLength);
			generateView(view, svgElem, points, delaunay);
		}, [points, view]);

		const handleCanvasEvent = (
			e: React.MouseEvent<SVGSVGElement, MouseEvent>,
		) => {
			const rect = e.currentTarget.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			switch (mode) {
				case "draw":
					dispatch(addPoint([x, y]));
					break;
				case "erase":
					dispatch(erasePoints({ x, y, radius: ERASE_MODE_RADIUS }));
					break;
			}
		};

		return (
			// SVG content will be rendered here outside of React.
			<>
				<svg
					ref={mergeRefs(svgRef, forwardedRef)}
					className={css.root}
					width='100vw'
					height='100vh'
					onClick={handleCanvasEvent}
					onPointerMove={(e) => {
						// Only if mouse button is pressed
						if (e.buttons === 1) handleCanvasEvent(e);
					}}
				/>
				<SvgCanvasCustomCursor mode={mode} svgRef={svgRef} />
			</>
		);
	},
);

export default SvgCanvas;
