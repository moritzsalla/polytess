import type { Mode } from "../../../config/modes";
import EraseCursor from "./EraseCursor";

export type SvgCanvasCustomCursorProps = {
	mode: Mode;
	svgRef: React.RefObject<SVGSVGElement>;
};

const CUSTOM_CURSORS = {
	erase: EraseCursor,
	draw: null,
} as const;

const SvgCanvasCustomCursor = (props: SvgCanvasCustomCursorProps) => {
	const { mode, ...rest } = props;

	if (mode in CUSTOM_CURSORS) {
		const CustomCursor = CUSTOM_CURSORS[mode as keyof typeof CUSTOM_CURSORS];
		if (CustomCursor) {
			return <CustomCursor mode={mode} {...rest} />;
		}
	}

	return null;
};

export default SvgCanvasCustomCursor;
