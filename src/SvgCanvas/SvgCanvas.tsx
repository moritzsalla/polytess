import css from "./SvgCanvas.module.css";
import React, { forwardRef, useEffect, useRef } from "react";
import Delaunator from "delaunator";
import { ERASE_MODE_RADIUS, type Mode, type View } from "../config";
import { generateView } from "./utils";
import { mergeRefs } from "../utils";

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
		const cursorRef = useRef<React.ElementRef<"div">>(null);

		useEffect(() => {
			const moveCursor = (e: MouseEvent) => {
				if (cursorRef.current) {
					cursorRef.current.style.left = `${e.clientX}px`;
					cursorRef.current.style.top = `${e.clientY}px`;
				}
			};

			if (mode === "erase") {
				document.addEventListener("mousemove", moveCursor);
			}

			return () => {
				document.removeEventListener("mousemove", moveCursor);
			};
		}, [mode]);

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
				{mode === "erase" && (
					<div
						ref={cursorRef}
						className={css.customCursor}
						style={{
							width: ERASE_MODE_RADIUS * 2,
							height: ERASE_MODE_RADIUS * 2,
						}}
					/>
				)}
			</>
		);
	},
);

export default SvgCanvas;
