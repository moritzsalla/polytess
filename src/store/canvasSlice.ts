// src/store/canvasSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { STORAGE_KEYS, type Mode, type View } from "../config";
import { generateRandomPoints } from "../utils";
import type { Points } from "../components/SvgCanvas/SvgCanvas";

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
	// Write to local storage
	localStorage.setItem(STORAGE_KEYS.MODE, action.payload);
};

const setViewAction = (state: CanvasState, action: PayloadAction<View>) => {
	// Update view
	state.view = action.payload;
	// Write to local storage
	localStorage.setItem(STORAGE_KEYS.VIEW, action.payload);
};

const addPointAction = (
	state: CanvasState,
	action: PayloadAction<[number, number]>,
) => {
	console.log("addPointAction");
	// Add a point to the array
	state.points.push(action.payload);
	// Write to local storage
	localStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify(state.points));
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
	// Write to local storage
	localStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify(state.points));
};

const clearPointsAction = (state: CanvasState) => {
	state.points = [];
	// Write to local storage
	localStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify([]));
};

const generatePointsAction = (state: CanvasState) => {
	// Generate random points
	state.points = generateRandomPoints();
	// Write to local storage
	localStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify(state.points));
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
	},
});

export const {
	addPoint,
	clearPoints,
	erasePoints,
	generatePoints,
	setMode,
	setView,
} = canvasSlice.actions;

export default canvasSlice.reducer;