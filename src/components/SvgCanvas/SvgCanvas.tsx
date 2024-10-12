import css from "./SvgCanvas.module.css";
import React, { useEffect, useRef } from "react";
import { generateView } from "./renderers";

import SvgCanvasCustomCursor from "./SvgCanvasCustomCursor/SvgCanvasCustomCursor";

import Delaunator from "../../lib/delaunator";
import { canvasActions } from "../../store/canvasSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { ERASE_CURSOR_RADIUS } from "./SvgCanvasCustomCursor/EraseCursor";

export type OnClickFn = React.SVGProps<SVGSVGElement>["onClick"];
export type OnDragFn = React.SVGProps<SVGSVGElement>["onPointerMove"];



const SvgCanvas = () => {
	// Ref for direct access to SVG DOM element
	// Used for performance-critical operations outside of React's render cycle
	const svgRef = useRef<React.ElementRef<"svg">>(null);

	const dispatch = useDispatch();
	const { mode, view, points, maxEdgeLength } = useSelector<
		RootState,
		RootState["canvas"]
	>((state) => state.canvas);

	// Effect for updating SVG content outside of React.
	// This approach bypasses React's virtual DOM for performance reasons.
	useEffect(() => {
		const svgElem = svgRef.current;
		if (!svgElem) {
			console.error("SVG element not found");
			return;
		}

		// Perform Delaunay triangulation and generate view.
		// This is done outside React's state management for better performance
		const delaunay = new Delaunator(points.flat(), maxEdgeLength);
		// Generate view based on delaunay triangulation result (points).
		generateView(view, svgElem, points, delaunay);
	}, [points, view, maxEdgeLength]);

	// Handler for both click and drag events
	const handleCanvasEvent = (
		e: React.MouseEvent<SVGSVGElement, MouseEvent>,
	) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		switch (mode) {
			case "draw":
				dispatch(canvasActions.addPoint([x, y]));
				break;
			case "erase":
				dispatch(
					canvasActions.erasePoints({ x, y, radius: ERASE_CURSOR_RADIUS }),
				);
				break;
		}
	};

	return (
		<>
			<svg
				// SVG content is rendered outside of React.
				ref={svgRef}
				className={css.root}
				onClick={handleCanvasEvent}
				// Handle dragging when mouse button is pressed
				onPointerMove={(e) => {
					if (e.buttons === 1) handleCanvasEvent(e);
				}}
			/>
			<SvgCanvasCustomCursor mode={mode} svgRef={svgRef} />
		</>
	);
};

export default SvgCanvas;
