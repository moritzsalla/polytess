import type { Points } from "./SvgCanvas/SvgCanvas";

export const generateCirclePoints = (
	centerX: number,
	centerY: number,
	radius: number,
	numPoints: number,
): Points => {
	return Array.from({ length: numPoints }, (_, i) => {
		const angle = (i / numPoints) * 2 * Math.PI;
		return [
			centerX + radius * Math.cos(angle),
			centerY + radius * Math.sin(angle),
		];
	});
};

export const generatePolygonPoints = (
	centerX: number,
	centerY: number,
	radius: number,
	numSides: number,
): Points => {
	return Array.from({ length: numSides }, (_, i) => {
		const angle = (i / numSides) * 2 * Math.PI;
		return [
			centerX + radius * Math.cos(angle),
			centerY + radius * Math.sin(angle),
		];
	});
};
