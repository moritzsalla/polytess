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

	// Redux hooks for state management
	const dispatch = useDispatch();
	const canvas = useSelector<RootState, RootState["canvas"]>(
		(state) => state.canvas,
	);
	const { mode, view, points, maxEdgeLength } = canvas;

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
		generateView(svgElem, delaunay, canvas);
	}, [points, view, maxEdgeLength, canvas]);

	// Handler for both click and drag events
	const handleCanvasEvent = (
		e: React.MouseEvent<SVGSVGElement, MouseEvent>,
	) => {
		// Get the coordinates of the click relative to the SVG element
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// Edit mode is momentary. It removes the polygon that was clicked using CSS,
		// but does not modify the state.
		// Therefore, recomputing the Delaunay triangulation will reset the canvas to pre-edit state.
		if (mode === "erase (snapshot)") {
			// check if clicked element is a polygon
			const target = e.target as SVGElement;
			if (target.tagName === "polygon") {
				target.style.display = "none";
			}
			return;
		}

		// Actions for each mode
		const actions = {
			draw: canvasActions.addPoint([x, y]),
			erase: canvasActions.erasePoints({
				x,
				y,
				radius: ERASE_CURSOR_RADIUS,
			}),
			"erase (snapshot)": null,
		} as const;

		dispatch(actions[mode] ?? { type: "NOOP" });
	};

	return (
		<>
			<svg
				// * NOTE: SVG content is rendered outside of React.
				ref={svgRef}
				aria-label='Canvas'
				className={css.root}
				onClick={handleCanvasEvent}
				onPointerMove={(e) => {
					// Handle dragging when mouse button is pressed
					if (e.buttons === 1) {
						handleCanvasEvent(e);
					}
				}}
			/>
			<SvgCanvasCustomCursor mode={mode} svgRef={svgRef} />
		</>
	);
};

export default SvgCanvas;
