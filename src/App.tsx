import { useState } from "react";
import "./App.css";
import DelaunayTriangulation, { type Points } from "./DelaunayTriangulation";

const generateCirclePoints = (
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

const generatePolygonPoints = (
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

const generateInitialPoints = (): Points => {
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
}

const App = () => {
	const [points, setPoints] = useState<Points>(generateInitialPoints);

	return (
		<div className='App'>
			<DelaunayTriangulation
				points={points}
				onDrag={
					// Capture new point on click and add it to the list of coordinates
					(e) => {
						const rect = e.currentTarget.getBoundingClientRect();
						const x = e.clientX - rect.left;
						const y = e.clientY - rect.top;
						setPoints((prev) => [...prev, [x, y]]);
					}
				}
				onClick={
					// Capture new point on click and add it to the list of coordinates
					(e) => {
						const rect = e.currentTarget.getBoundingClientRect();
						const x = e.clientX - rect.left;
						const y = e.clientY - rect.top;
						setPoints((prev) => [...prev, [x, y]]);
					}
				}
			/>
		</div>
	);
};

export default App;
