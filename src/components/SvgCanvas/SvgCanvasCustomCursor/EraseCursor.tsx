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
