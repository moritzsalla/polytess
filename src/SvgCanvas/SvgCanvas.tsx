import css from "./SvgCanvas.module.css";
import React, { forwardRef, useEffect, useRef } from "react";
import Delaunator from "delaunator";
import { ERASE_MODE_RADIUS, type Mode, type View } from "../config";
import { generateView } from "./utils";
import { mergeRefs } from "../utils";
import { useMove } from "@use-gesture/react";

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
				<CustomCursor mode={mode} svgRef={svgRef} />
			</>
		);
	},
);

const CustomCursor = ({
	mode,
	svgRef,
}: {
	mode: Mode;
	svgRef: React.RefObject<SVGSVGElement>;
}) => {
	const cursorRef = useRef<React.ElementRef<"div">>(null);

	useMove(
		({ xy: [x, y] }) => {
			if (!cursorRef.current) return;
			cursorRef.current.style.left = `${x}px`;
			cursorRef.current.style.top = `${y}px`;
		},
		{
			enabled: mode === "erase",
			target: svgRef,
		},
	);

	return (
		<div
			ref={cursorRef}
			className={css.customCursor}
			style={{
				width: ERASE_MODE_RADIUS * 2,
				height: ERASE_MODE_RADIUS * 2,
			}}
		/>
	);
};

export default SvgCanvas;
