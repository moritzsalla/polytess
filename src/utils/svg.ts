import type { Points } from "../components/SvgCanvas/renderers";

export const calculateBoundingBox = (
	p1: number[],
	p2: number[],
	p3: number[],
): [number, number, number, number] => {
	const minX = Math.min(p1[0], p2[0], p3[0]);
	const minY = Math.min(p1[1], p2[1], p3[1]);
	const maxX = Math.max(p1[0], p2[0], p3[0]);
	const maxY = Math.max(p1[1], p2[1], p3[1]);
	return [minX, minY, maxX - minX, maxY - minY];
};

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

export const generateRandomPoints = (): Points => {
	const w = window.innerWidth;
	const h = window.innerHeight;
	const points: Points = [];

	// Function to generate a random number between min and max
	const random = (min: number, max: number) =>
		Math.random() * (max - min) + min;

	// Generate random shapes
	const numShapes = Math.floor(random(3, 8));
	for (let i = 0; i < numShapes; i++) {
		const x = random(0, w);
		const y = random(0, h);
		const radius = random(30, 100);
		const numSides = Math.floor(random(3, 8));

		if (Math.random() < 0.5) {
			// 50% chance of circle
			points.push(
				...generateCirclePoints(x, y, radius, Math.floor(random(20, 50))),
			);
		} else {
			// 50% chance of polygon
			points.push(...generatePolygonPoints(x, y, radius, numSides));
		}
	}

	// Add random individual points
	const numExtraPoints = Math.floor(random(10, 30));
	for (let i = 0; i < numExtraPoints; i++) {
		points.push([random(0, w), random(0, h)]);
	}

	return points;
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
