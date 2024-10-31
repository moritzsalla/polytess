import { useRef } from "react";
import css from "./SvgCanvasCustomCursor.module.css";
import { useMove } from "@use-gesture/react";
import type { SvgCanvasCustomCursorProps } from "./SvgCanvasCustomCursor";

export const ERASE_CURSOR_RADIUS = 60;

const EraseCursor = ({ mode, svgRef }: SvgCanvasCustomCursorProps) => {
	const cursorRef = useRef<React.ElementRef<"div">>(null);

	useMove(
		({ xy: [x, y] }) => {
			if (!cursorRef.current) return;

			// Prevent cursor from showing up at 0,0
			cursorRef.current.style.display = "block";
			// Hint to browser to perform optimizations
			cursorRef.current.style.willChange = "transform";
			// Use gpu-accelerated transform to move the cursor
			cursorRef.current.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;
		},
		{
			enabled: mode === "erase (vertices)",
			target: svgRef,
		},
	);

	return (
		<div
			ref={cursorRef}
			className={css.root}
			style={
				{
					"--radius": `${ERASE_CURSOR_RADIUS * 2}px`,
				} as React.CSSProperties
			}
		/>
	);
};

export default EraseCursor;
