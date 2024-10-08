// src/store/canvasSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { STORAGE_KEYS, type Mode } from "../config";
import type { View, Points } from "../components/SvgCanvas/renderers";
import { generateRandomPoints } from "../components/utils/svg";

type CanvasState = {
	mode: Mode;
	view: View;
	points: Points;
};

const getInitialState = (): CanvasState => {
	return {
		mode: (localStorage.getItem(STORAGE_KEYS.MODE) as Mode) || "draw",
		view: (localStorage.getItem(STORAGE_KEYS.VIEW) as View) || "gradient",
		points: JSON.parse(localStorage.getItem(STORAGE_KEYS.POINTS) || "[]"),
	};
};

const setModeAction = (state: CanvasState, action: PayloadAction<Mode>) => {
	// Update mode
	state.mode = action.payload;
};

const setViewAction = (state: CanvasState, action: PayloadAction<View>) => {
	// Update view
	state.view = action.payload;
};

const addPointAction = (
	state: CanvasState,
	action: PayloadAction<[number, number]>,
) => {
	// Add a point to the array
	state.points.push(action.payload);
};

const erasePointsAction = (
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

const clearPointsAction = (state: CanvasState) => {
	state.points = [];
};

const generatePointsAction = (state: CanvasState) => {
	// Generate random points
	state.points = generateRandomPoints();
};

// Save program to localhost
// (changes will persist between page reloads)
const saveToLocalStorageAction = (state: CanvasState) => {
	// Save program snapshot to local storage
	localStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify(state.points));
	localStorage.setItem(STORAGE_KEYS.VIEW, state.view);
	localStorage.setItem(STORAGE_KEYS.MODE, state.mode);
};

const canvasSlice = createSlice({
	name: "canvas",
	initialState: getInitialState(),
	reducers: {
		setMode: setModeAction,
		setView: setViewAction,
		addPoint: addPointAction,
		erasePoints: erasePointsAction,
		clearPoints: clearPointsAction,
		generatePoints: generatePointsAction,
		saveToLocalStorage: saveToLocalStorageAction,
	},
});

export const {
	addPoint,
	clearPoints,
	erasePoints,
	generatePoints,
	setMode,
	setView,
	saveToLocalStorage,
} = canvasSlice.actions;

export default canvasSlice.reducer;
