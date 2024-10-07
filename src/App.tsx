import { useRef } from "react";
import SvgCanvas, { type Points } from "./components/SvgCanvas/SvgCanvas";
import {
	ERASE_MODE_RADIUS,
	STORAGE_KEYS,
	type Mode,
	type View,
} from "./config";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

import { usePersistentState } from "./hooks/usePersistentStorage";
import Menu from "./components/Menu/Menu";
import { downloadSvgFile, generateInitialPoints } from "./utils";

// TODO: image trace view

const ERROR_FALLBACK_COMPONENT = <div>Something went wrong</div>;

const App = () => {
	const svgRef = useRef<SVGSVGElement>(null);

	const [mode, setMode] = usePersistentState<Mode>(STORAGE_KEYS.MODE, "draw");
	const [view, setView] = usePersistentState<View>(
		STORAGE_KEYS.VIEW,
		"gradient",
	);
	const [points, setPoints] = usePersistentState<Points>(
		STORAGE_KEYS.POINTS,
		[],
	);

	// Capture new point on click and add it to the list of coordinates
	const handleCanvasEvent = (
		e: React.MouseEvent<SVGSVGElement, MouseEvent>,
	) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		switch (mode) {
			case "draw":
				setPoints((prev) => [...prev, [x, y]]);
				break;
			case "erase":
				setPoints((prev) =>
					prev.filter((point) => {
						const distance = Math.sqrt(
							Math.pow(point[0] - x, 2) + Math.pow(point[1] - y, 2),
						);
						return distance > ERASE_MODE_RADIUS;
					}),
				);
				break;
			default:
				return;
		}
	};

	// Export the SVG to a file
	const handleExportSVG = () => {
		if (svgRef.current) {
			downloadSvgFile(svgRef.current, "export");
		} else {
			console.error(
				"Attempted download: SVG element not found. Did you forget to assign the ref?",
			);
		}
	};

	return (
		<div className='App'>
			<ErrorBoundary
				// Force re-render of canvas when key changes. This won't clear the canvas.
				key={view}
				fallback={ERROR_FALLBACK_COMPONENT}
			>
				<SvgCanvas
					ref={svgRef}
					view={view}
					points={points}
					mode={mode}
					onClick={handleCanvasEvent}
					onDrag={handleCanvasEvent}
				/>
			</ErrorBoundary>
			<Menu
				view={view}
				mode={mode}
				setView={setView}
				setMode={setMode}
				onExport={handleExportSVG}
				onClear={() => setPoints([])}
				onGenerate={() => setPoints(generateInitialPoints())}
			/>
		</div>
	);
};

export default App;
