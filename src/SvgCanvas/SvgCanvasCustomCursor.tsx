import css from "./SvgCanvas.module.css";

import { useRef } from "react";
import { ERASE_MODE_RADIUS, type Mode } from "../config";
import { useMove } from "@use-gesture/react";

const SvgCanvasCustomCursor = ({
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

export default SvgCanvasCustomCursor;
