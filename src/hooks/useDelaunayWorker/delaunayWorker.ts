import Delaunator from "../../lib/delaunator";
import type { Points } from "../../components/SvgCanvas/renderers";

type WorkerMessage = {
	points: Points;
	maxEdgeLength: number;
};

export type WorkerResponse = typeof Delaunator.prototype.triangles;

const messageProcess = (event: MessageEvent<WorkerMessage>) => {
	const { points, maxEdgeLength } = event.data;

	const delaunay = new Delaunator(points.flat(), maxEdgeLength);

	globalThis.postMessage(delaunay.triangles satisfies WorkerResponse);
};

globalThis.addEventListener("message", messageProcess);
