import type { Points } from "../../components/SvgCanvas/renderers";
import type { WorkerResponse } from "./delaunayWorker";

type WorkerTask = {
	points: Points;
	maxEdgeLength: number;
	resolve: (value: WorkerResponse) => void;
	reject: (reason: any) => void;
};

export class WorkerManager {
	private static instance: WorkerManager | null = null;
	private workers: Worker[] = [];
	private taskQueue: WorkerTask[] = [];
	private busyWorkers: Set<Worker> = new Set();
	private readonly maxWorkers: number;

	private constructor(maxWorkers = navigator.hardwareConcurrency || 4) {
		this.maxWorkers = maxWorkers;
	}

	public static getInstance(): WorkerManager {
		if (!WorkerManager.instance) {
			WorkerManager.instance = new WorkerManager();
		}
		return WorkerManager.instance;
	}

	private createWorker(): Worker {
		const worker = new Worker(
			new URL("./delaunayWorker.ts", import.meta.url),
		);

		worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
			this.handleWorkerComplete(worker, event.data);
		};

		worker.onerror = (error) => {
			console.error("Worker error:", error);
			this.handleWorkerError(worker, error);
		};

		return worker;
	}

	private getAvailableWorker(): Worker | null {
		// Return existing idle worker
		const availableWorker = this.workers.find(
			(w) => !this.busyWorkers.has(w),
		);
		if (availableWorker) return availableWorker;

		// Create new worker if under limit
		if (this.workers.length < this.maxWorkers) {
			const newWorker = this.createWorker();
			this.workers.push(newWorker);
			return newWorker;
		}

		return null;
	}

	private handleWorkerComplete(worker: Worker, result: WorkerResponse) {
		const task = this.taskQueue.shift();
		if (task) {
			task.resolve(result);
		}
		this.busyWorkers.delete(worker);
		this.processNextTask();
	}

	private handleWorkerError(worker: Worker, error: ErrorEvent) {
		const task = this.taskQueue.shift();
		if (task) {
			task.reject(error);
		}
		this.busyWorkers.delete(worker);
		this.processNextTask();
	}

	private processNextTask() {
		if (this.taskQueue.length === 0) return;

		const worker = this.getAvailableWorker();
		if (!worker) return; // All workers busy

		const task = this.taskQueue[0];
		this.busyWorkers.add(worker);
		worker.postMessage({
			points: task.points,
			maxEdgeLength: task.maxEdgeLength,
		});
	}

	public async processDelaunay(
		points: Points,
		maxEdgeLength: number,
	): Promise<WorkerResponse> {
		return new Promise((resolve, reject) => {
			this.taskQueue.push({ points, maxEdgeLength, resolve, reject });
			this.processNextTask();
		});
	}

	public terminateAll() {
		this.workers.forEach((worker) => worker.terminate());
		this.workers = [];
		this.busyWorkers.clear();
		this.taskQueue = [];
	}
}
