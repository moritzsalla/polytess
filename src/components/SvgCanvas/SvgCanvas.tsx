import css from "./SvgCanvas.module.css";
import React, { useMemo } from "react";

import SvgCanvasCustomCursor from "./SvgCanvasCustomCursor/SvgCanvasCustomCursor";
import { canvasActions } from "../../store/canvasSlice";
import { ERASE_CURSOR_RADIUS } from "./SvgCanvasCustomCursor/EraseCursor";

import { useCanvas } from "../../hooks/useCanvas";
import { useDispatch } from "react-redux";
import { useDelaunayWorker } from "../../hooks/useDelaunayWorker";
import { MODES, type ModeKey } from "../../config/modes";
import { useEditorPosition } from "../../hooks/useEditorPosition";

export type OnClickFn = React.SVGProps<SVGSVGElement>["onClick"];
export type OnDragFn = React.SVGProps<SVGSVGElement>["onPointerMove"];

const SvgCanvas = () => {
	const { svgRef, isLoading } = useDelaunayWorker();
	const { editorPosition } = useEditorPosition();

	const dispatch = useDispatch();
	const { mode } = useCanvas();
	const currentMode = useMemo(() => MODES.find((m) => m.key === mode), [mode]);

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
		if (mode === "eraseFaces") {
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
			eraseVertices: canvasActions.erasePoints({
				x,
				y,
				radius: ERASE_CURSOR_RADIUS,
			}),
			eraseFaces: null,
		} as const satisfies Record<ModeKey, unknown>;

		dispatch(actions[mode] ?? { type: "NOOP" });
	};

	return (
		<>
			{isLoading && (
				<div
					data-editor-position={editorPosition}
					className={css.loadingSpinner}
				/>
			)}
			<svg
				// * NOTE: SVG content is rendered *outside of React* for performance reasons.
				ref={svgRef}
				aria-label='Canvas'
				className={css.root}
				onClick={handleCanvasEvent}
				onPointerMove={(e) => {
					// Handle dragging when mouse button is pressed
					if (e.buttons !== 1) return;
					handleCanvasEvent(e);
				}}
			/>
			{currentMode?.key === "eraseVertices" && (
				<SvgCanvasCustomCursor mode={currentMode} svgRef={svgRef} />
			)}
		</>
	);
};

export default SvgCanvas;
