// src/store/canvasSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Point, Points, View } from "../components/SvgCanvas/renderers";
import { generateRandomPoints } from "../utils/svg";
import type { Mode } from "../config/modes";
import { LOCAL_STORAGE_KEYS } from "../config/local-storage";
import { detectEdges } from "../utils/image";

export type CanvasState = {
	mode: Mode;
	view: View;
	points: Points;
	maxEdgeLength: number;
	gradient: {
		startColor: string;
		endColor: string;
	};
};

const getInitialState = (): CanvasState => {
	const mode =
		(localStorage.getItem(LOCAL_STORAGE_KEYS.MODE) as Mode) ?? "draw";
	const view =
		(localStorage.getItem(LOCAL_STORAGE_KEYS.VIEW) as View) ?? "gradient";
	const points = JSON.parse(
		localStorage.getItem(LOCAL_STORAGE_KEYS.POINTS) ?? "[]",
	);
	const maxEdgeLength = parseInt(
		localStorage.getItem(LOCAL_STORAGE_KEYS.MAX_EDGE_LENGTH) ?? "500",
	);
	// Default colors must be in hex format: #RRGGBB
	const startColor =
		localStorage.getItem(LOCAL_STORAGE_KEYS.GRADIENT_COLOR_START) ??
		"#ff0000";
	const endColor =
		localStorage.getItem(LOCAL_STORAGE_KEYS.GRADIENT_COLOR_END) ?? "#0000ff";

	return {
		mode,
		view,
		points,
		maxEdgeLength,
		gradient: {
			startColor,
			endColor,
		},
	};
};

// Save program to local storage
// (changes will persist between page reloads)
const saveToLocalStorage = (state: CanvasState) => {
	// Save program snapshot to local storage
	localStorage.setItem(
		LOCAL_STORAGE_KEYS.POINTS,
		JSON.stringify(state.points),
	);
	localStorage.setItem(LOCAL_STORAGE_KEYS.VIEW, state.view);
	localStorage.setItem(LOCAL_STORAGE_KEYS.MODE, state.mode);
	localStorage.setItem(
		LOCAL_STORAGE_KEYS.MAX_EDGE_LENGTH,
		state.maxEdgeLength.toString(),
	);
	localStorage.setItem(
		LOCAL_STORAGE_KEYS.GRADIENT_COLOR_START,
		state.gradient.startColor,
	);
	localStorage.setItem(
		LOCAL_STORAGE_KEYS.GRADIENT_COLOR_END,
		state.gradient.endColor,
	);
};

const setMode = (state: CanvasState, action: PayloadAction<Mode>) => {
	state.mode = action.payload;
};

const setView = (state: CanvasState, action: PayloadAction<View>) => {
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
	// Update points array to remove points within the radius of the click
	state.points = state.points.filter((point) => {
		const distance = Math.sqrt(
			Math.pow(point[0] - action.payload.x, 2) +
				Math.pow(point[1] - action.payload.y, 2),
		);
		return distance > action.payload.radius;
	});
};

const clearPoints = (state: CanvasState) => {
	state.points = [];
};

const randomize = (state: CanvasState) => {
	// Generate random points
	state.points = generateRandomPoints();
};

const setPoints = (state: CanvasState, action: PayloadAction<Points>) => {
	state.points = action.payload;
};

const setMaxEdgeLength = (
	state: CanvasState,
	action: PayloadAction<number>,
) => {
	state.maxEdgeLength = action.payload;
};

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
		setPoints,
		saveToLocalStorage,
		setMaxEdgeLength,
		setMode,
		setView,
		setGradientStartColor,
		setGradientEndColor,
	},
});

export const { ...canvasActions } = canvasSlice.actions;
export default canvasSlice.reducer;
