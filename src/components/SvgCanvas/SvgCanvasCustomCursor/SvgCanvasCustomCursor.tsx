import type { Mode, ModeKey } from "../../../config/modes";
import EraseCursor from "./EraseCursor";

export type SvgCanvasCustomCursorProps = {
	mode: Mode;
	svgRef: React.RefObject<SVGSVGElement>;
};

const CUSTOM_CURSORS = {
	eraseVertices: EraseCursor,
	eraseFaces: EraseCursor,
	draw: null,
} as const satisfies Record<
	ModeKey,
	(({ mode, svgRef }: SvgCanvasCustomCursorProps) => JSX.Element) | null
>;

const SvgCanvasCustomCursor = ({
	mode,
	...rest
}: SvgCanvasCustomCursorProps) => {
	const CustomCursor = CUSTOM_CURSORS[mode.key];
	if (CustomCursor) {
		return <CustomCursor mode={mode} {...rest} />;
	}

	return null;
};

export default SvgCanvasCustomCursor;
