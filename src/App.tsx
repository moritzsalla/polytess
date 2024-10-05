import { useState } from "react";
import "./App.css";
import SvgCanvas, { type Points } from "./SvgCanvas/SvgCanvas";
import { VIEWS, type View } from "./config";
import ErrorBoundary from "./ErrorBoundary";

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
};

// TODO: save drawing to local storage to persist between reloads
// TODO: gradient view
// TODO: image trace view
// TODO: export SVG
const App = () => {
	const [view, setView] = useState<View>("lines");
	const [points, setPoints] = useState<Points>(generateInitialPoints);

	return (
		<div className='App'>
			<ErrorBoundary fallback={<>Try again.</>}>
				<SvgCanvas
					// Force re-render when key changes. This won't clear the canvas.
					key={view}
					view={view}
					points={points}
					onClick={
						// Capture new point on click and add it to the list of coordinates
						(e) => {
							const rect = e.currentTarget.getBoundingClientRect();
							const x = e.clientX - rect.left;
							const y = e.clientY - rect.top;
							setPoints((prev) => [...prev, [x, y]]);
						}
					}
					onDrag={
						// Capture new point on click and add it to the list of coordinates
						(e) => {
							const rect = e.currentTarget.getBoundingClientRect();
							const x = e.clientX - rect.left;
							const y = e.clientY - rect.top;
							setPoints((prev) => [...prev, [x, y]]);
						}
					}
				/>
			</ErrorBoundary>
			<menu
				style={{ position: "fixed", bottom: 0, right: 0, padding: "1rem" }}>
				<span>Current view: {view}</span>
				<div>
					View:{" "}
					{VIEWS.map(({ name }, index) => (
						<button
							key={index + name}
							type='button'
							onClick={() => setView(name)}>
							{name}
						</button>
					))}
				</div>
			</menu>
		</div>
	);
};

export default App;
