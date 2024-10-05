import { useRef, useState } from "react";
import "./App.css";
import SvgCanvas, {
	type OnClickFn,
	type OnDragFn,
	type Points,
} from "./SvgCanvas/SvgCanvas";
import { VIEWS, type View } from "./config";
import ErrorBoundary from "./ErrorBoundary/ErrorBoundary";
import { downloadSvgFile, generateInitialPoints } from "./utils";
import Button from "./Button/Button";

// TODO: save drawing to local storage to persist between reloads
// TODO: gradient view
// TODO: image trace view

const ERROR_FALLBACK_COMPONENT = <div>Something went wrong</div>;

const App = () => {
	const svgRef = useRef<SVGSVGElement>(null);
	const [view, setView] = useState<View>("lines");
	const [points, setPoints] = useState<Points>([]);

	// Capture new point on click and add it to the list of coordinates
	const handleCanvasOnClickEvent: OnClickFn = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		setPoints((prev) => [...prev, [x, y]]);
	};

	// Capture new point on click and add it to the list of coordinates
	const handleCanvasOnDragEvent: OnDragFn = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		setPoints((prev) => [...prev, [x, y]]);
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

	// Remove points from the canvas
	const handleClearCanvas = () => {
		setPoints([]);
	};

	// Generate random points for the canvas for demo purposes
	const handleGenerateRandomPoints = () => {
		setPoints(generateInitialPoints());
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
					onClick={handleCanvasOnClickEvent}
					onDrag={handleCanvasOnDragEvent}
				/>
			</ErrorBoundary>
			<menu
				style={{ position: "fixed", bottom: 0, right: 0, padding: "1rem" }}
			>
				<span>Current view: {view}</span>
				<div>
					View:{" "}
					{VIEWS.map(({ name }, index) => (
						<Button key={index + name} onClick={() => setView(name)}>
							{name}
						</Button>
					))}
				</div>
				<div>
					<Button onClick={handleExportSVG}>Export SVG</Button>
				</div>
				<div>
					<Button onClick={handleClearCanvas}>Clear SVG</Button>
				</div>
				<div>
					<Button onClick={handleGenerateRandomPoints}>
						Generate random points
					</Button>
				</div>
			</menu>
		</div>
	);
};

export default App;
