import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Point, Points, View } from "../components/SvgCanvas/renderers";
import { generateRandomPoints } from "../utils/svg";
import { store } from "../utils/storage";
import type { ModeKey } from "../config/modes";

export type CanvasState = {
	mode: ModeKey;
	view: View;
	points: Points;
	maxEdgeLength: number;
	gradient: {
		startColor: string;
		endColor: string;
	};
	imageFile: File | null;
};

// Attempt to retrieve the program state from local storage.
// If no state is found, return hardcoded defaults.
const getInitialState = (): CanvasState => {
	const mode = store.get<ModeKey>("mode") ?? "draw";
	const view = store.get<View>("view") ?? "gradient";
	const points = store.get<Points>("points") ?? [];
	const maxEdgeLength = store.get<number>("max-edge-length") ?? 500;
	// Default colors must be in hex format: #RRGGBB
	const startColor = store.get<string>("gradient-color-start") ?? "#ff0000";
	const endColor = store.get<string>("gradient-color-end") ?? "#0000ff";

	return {
		mode,
		view,
		points,
		maxEdgeLength,
		gradient: {
			startColor,
			endColor,
		},
		imageFile: null,
	};
};

// Save program to local storage
// (changes will persist between page reloads)
const saveToLocalStorage = (state: CanvasState) => {
	// Save program snapshot to local storage
	store.put("points", state.points);
	store.put("view", state.view);
	store.put("mode", state.mode);
	store.put("max-edge-length", state.maxEdgeLength);
	store.put("gradient-color-start", state.gradient.startColor);
	store.put("gradient-color-end", state.gradient.endColor);
};

const setMode = (state: CanvasState, action: PayloadAction<ModeKey>) => {
	// Change interaction mode
	state.mode = action.payload;
};

const setView = (state: CanvasState, action: PayloadAction<View>) => {
	// Change rendering view
	state.view = action.payload;
};

const addPoint = (state: CanvasState, action: PayloadAction<Point>) => {
	// Add a point to the array
	state.points.push(action.payload);
};

const erasePoints = (
	state: CanvasState,
	action: PayloadAction<{ x: number; y: number; radius: number }>,
) => {
	const { x, y, radius } = action.payload;
	const radiusSquared = radius * radius;

	state.points = state.points.filter((point) => {
		const dx = point[0] - x;
		const dy = point[1] - y;
		const distanceSquared = dx * dx + dy * dy;
		return distanceSquared > radiusSquared + 0.0001;
	});
};

const clearPoints = (state: CanvasState) => {
	// Delete all points from the array.
	// Cannot be restored unless saved to local storage.
	state.points = [];
};

const randomize = (state: CanvasState) => {
	// Generate random points.
	state.points = generateRandomPoints();
};

const setPoints = (state: CanvasState, action: PayloadAction<Points>) => {
	// Set all points at once.
	state.points = action.payload;
};

const setMaxEdgeLength = (
	state: CanvasState,
	action: PayloadAction<number>,
) => {
	// Setting maximum edge length will cutoff long edges,
	// adding white space between points.
	state.maxEdgeLength = action.payload;
};

// GRADIENT

const setGradientStartColor = (
	state: CanvasState,
	action: PayloadAction<string>,
) => {
	state.gradient.startColor = action.payload;
};

const setGradientEndColor = (
	state: CanvasState,
	action: PayloadAction<string>,
) => {
	state.gradient.endColor = action.payload;
};

const canvasSlice = createSlice({
	name: "canvas",
	initialState: getInitialState(),
	reducers: {
		addPoint,
		clearPoints,
		erasePoints,
		randomize,
		saveToLocalStorage,
		setGradientEndColor,
		setGradientStartColor,
		setMaxEdgeLength,
		setMode,
		setPoints,
		setView,
	},
});

export const { ...canvasActions } = canvasSlice.actions;
export default canvasSlice.reducer;
