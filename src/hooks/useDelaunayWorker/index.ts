import { useEffect, useMemo, useRef, useState } from "react";
import { generateView } from "../../components/SvgCanvas/renderers";
import { useCanvas } from "../useCanvas";
import type { WorkerResponse } from "./delaunayWorker";

export const useDelaunayWorker = () => {
	const canvas = useCanvas();
	const { points, maxEdgeLength } = canvas;

	const [isLoading, setIsLoading] = useState(false);

	// SVG ref for direct DOM manipulation
	// Bypasses React's reconciliation for performance-critical rendering
	const svgRef = useRef<React.ElementRef<"svg">>(null);

	// Instantiate Web Worker for off-main-thread Delaunay triangulation
	// useMemo ensures single worker instance throughout component lifecycle
	const worker = useMemo(
		() => new Worker(new URL("./delaunayWorker.ts", import.meta.url)),
		[],
	);

	// Effect for managing worker communication and SVG updates
	// Runs on canvas state changes, ensuring up-to-date visualizations
	useEffect(() => {
		const svgElem = svgRef.current;
		if (!svgElem) {
			console.error("SVG element not found");
			return;
		}

		setIsLoading(true);

		// Dispatch data to worker and listen for response
		worker.postMessage({ points, maxEdgeLength });

		const handleWorkerMessage = (event: MessageEvent<WorkerResponse>) => {
			const delaunayTriangles = event.data;
			generateView(svgElem, delaunayTriangles, canvas);
			setIsLoading(false);
		};

		worker.addEventListener("message", handleWorkerMessage);

		// Cleanup
		return () => {
			worker.removeEventListener("message", handleWorkerMessage);
		};
	}, [canvas, maxEdgeLength, points, worker]);

	return { svgRef, isLoading };
};
