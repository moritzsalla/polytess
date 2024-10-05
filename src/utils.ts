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

// TODO fully randomize
export const generateInitialPoints = (): Points => {
	const leftCircle = generateCirclePoints(150, 250, 120, 40);
	const rightCircle = generateCirclePoints(450, 250, 100, 30);
	const topPolygon = generatePolygonPoints(300, 100, 80, 4);
	const bottomPolygon = generatePolygonPoints(300, 400, 70, 6);

	// Additional points for more complex triangulation
	const additionalPoints: Points = [
		[50, 50],
		[550, 50],
		[50, 450],
		[550, 450], // corners
		[300, 250], // center
		[200, 150],
		[400, 150],
		[200, 350],
		[400, 350], // midpoints
	];

	return [
		...leftCircle,
		...rightCircle,
		...topPolygon,
		...bottomPolygon,
		...additionalPoints,
	];
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

export const mergeRefs =
	<T extends any>(
		...refs: Array<React.Ref<T> | undefined>
	): React.RefCallback<T> =>
	(value) => {
		refs.forEach((ref) => {
			if (typeof ref === "function") {
				ref(value);
			} else if (ref) {
				(ref as React.MutableRefObject<T | null>).current = value;
			}
		});
	};
