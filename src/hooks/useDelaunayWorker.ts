import { useEffect, useRef, useState } from "react";
import { generateView } from "../components/SvgCanvas/renderers";
import { useCanvas } from "./useCanvas";
import { WorkerManager } from "../services/workers/WorkerManager";

export const useDelaunayWorker = () => {
	const canvas = useCanvas();
	const { points, maxEdgeLength } = canvas;
	const [isLoading, setIsLoading] = useState(false);
	const svgRef = useRef<SVGSVGElement>(null);

	// Keep track of the latest request to avoid race conditions
	const latestRequestId = useRef<number>(0);

	useEffect(() => {
		const svgElem = svgRef.current;
		if (!svgElem) {
			console.error("SVG element not found");
			return;
		}

		const requestId = ++latestRequestId.current;
		setIsLoading(true);

		const workerManager = WorkerManager.getInstance();

		let isMounted = true;

		const processData = async () => {
			try {
				const delaunayTriangles = await workerManager.processDelaunay(
					points,
					maxEdgeLength,
				);

				// Only update if this is still the latest request and component is mounted
				if (requestId === latestRequestId.current && isMounted) {
					generateView(svgElem, delaunayTriangles, canvas);
					setIsLoading(false);
				}
			} catch (error) {
				console.error("Failed to process Delaunay triangulation:", error);
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		processData();

		// Cleanup
		return () => {
			isMounted = false;
		};
	}, [canvas, maxEdgeLength, points]);

	// Cleanup worker manager on component unmount.
	useEffect(() => {
		return () => {
			// Only terminate workers if no other components are using them.
			if (document.querySelectorAll("svg").length <= 1) {
				WorkerManager.getInstance().terminateAll();
			}
		};
	}, []);

	return { svgRef, isLoading };
};
