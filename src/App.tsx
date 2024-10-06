import { useRef } from "react";
import SvgCanvas, {
	type OnClickFn,
	type OnDragFn,
	type Points,
} from "./SvgCanvas/SvgCanvas";
import { STORAGE_KEYS, type View } from "./config";
import ErrorBoundary from "./ErrorBoundary/ErrorBoundary";
import { downloadSvgFile, generateInitialPoints } from "./utils";
import { usePersistentState } from "./usePersistentStorage";
import Menu from "./Menu/Menu";

// TODO: image trace view

const ERROR_FALLBACK_COMPONENT = <div>Something went wrong</div>;

const App = () => {
	const svgRef = useRef<SVGSVGElement>(null);

	const [view, setView] = usePersistentState<View>(
		STORAGE_KEYS.VIEW,
		"gradient",
	);
	const [points, setPoints] = usePersistentState<Points>(
		STORAGE_KEYS.POINTS,
		[],
	);

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
			<Menu
				view={view}
				setView={setView}
				onExport={handleExportSVG}
				onClear={() => setPoints([])}
				onGenerate={() => setPoints(generateInitialPoints())}
			/>
		</div>
	);
};

export default App;
