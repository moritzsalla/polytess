import { useState } from "react";
import "./App.css";
import DelaunayTriangulation, { type Points } from "./DelaunayTriangulation";

const generateCirclePoints = (
	centerX: number,
	centerY: number,
	radius: number,
	numPoints: number,
): Points => {
	const points: Points = [];
	for (let i = 0; i < numPoints; i++) {
		const angle = (i / numPoints) * 2 * Math.PI;
		const x = centerX + radius * Math.cos(angle);
		const y = centerY + radius * Math.sin(angle);
		points.push([x, y]);
	}
	return points;
};

const generateInitialPoints = (): Points => {
	const circle1 = generateCirclePoints(200, 200, 150, 20);
	const circle2 = generateCirclePoints(200, 200, 100, 15);
	return [...circle1, ...circle2];
};

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
