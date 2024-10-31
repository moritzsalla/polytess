import Delaunator from "../../lib/delaunator";
import type { Points } from "../../components/SvgCanvas/renderers";

type WorkerMessage = {
	points: Points;
	maxEdgeLength: number;
};

export type WorkerResponse = typeof Delaunator.prototype.triangles;

const messageProcess = async (event: MessageEvent<WorkerMessage>) => {
	try {
		const { points, maxEdgeLength } = event.data;

		// Validate input
		if (!Array.isArray(points) || points.length === 0) {
			throw new Error("Invalid points array");
		}

		// Process data
		const delaunay = new Delaunator(points.flat(), maxEdgeLength);

		// Send back the result
		globalThis.postMessage(delaunay.triangles satisfies WorkerResponse);
	} catch (error) {
		// Send error back to main thread
		globalThis.postMessage({
			error:
				error instanceof Error ? error.message : "Unknown error occurred",
		});
	}
};

// Set up error handling
globalThis.addEventListener("error", (event) => {
	globalThis.postMessage({
		error: `Worker error: ${event.message}`,
	});
});

globalThis.addEventListener("message", messageProcess);
