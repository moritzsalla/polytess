import css from "./SvgCanvas.module.css";

import { useRef } from "react";
import { useMove } from "@use-gesture/react";
import type { Mode } from "../../config/modes";

export const ERASE_MODE_RADIUS = 60;

type SvgCanvasCustomCursorProps = {
	mode: Mode;
	svgRef: React.RefObject<SVGSVGElement>;
};

const SvgCanvasCustomCursor = (props: SvgCanvasCustomCursorProps) => {
	if (props.mode === "erase") {
		return <EraseCursor {...props} />;
	}

	return null;
};

const EraseCursor = ({ mode, svgRef }: SvgCanvasCustomCursorProps) => {
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
			style={
				{
					"--radius": `${ERASE_MODE_RADIUS * 2}px`,
				} as React.CSSProperties
			}
		/>
	);
};

export default SvgCanvasCustomCursor;
