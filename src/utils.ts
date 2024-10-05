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

export const downloadSvgFile = (svg: SVGSVGElement, filename: string) => {
	// Get the SVG data
	const svgData = new XMLSerializer().serializeToString(svg);
	const svgBlob = new Blob([svgData], {
		type: "image/svg+xml;charset=utf-8",
	});
	const svgUrl = URL.createObjectURL(svgBlob);

	// Create a link and trigger the download
	const downloadLink = document.createElement("a");
	downloadLink.href = svgUrl;
	downloadLink.download = `${filename}.svg`;
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);

	// Clean up the URL object
	URL.revokeObjectURL(svgUrl);
};
