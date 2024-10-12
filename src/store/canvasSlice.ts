// src/store/canvasSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Points } from "../components/SvgCanvas/renderers";
import { generateRandomPoints } from "../utilities/svg";
import type { Mode } from "../config/modes";
import { LOCAL_STORAGE_KEYS } from "../config/local-storage";
import type { View } from "../config/views";

type CanvasState = {
	mode: Mode;
	view: View;
	points: Points;
};

const getInitialState = (): CanvasState => {
	const mode =
		(localStorage.getItem(LOCAL_STORAGE_KEYS.MODE) as Mode) || "draw";
	const view =
		(localStorage.getItem(LOCAL_STORAGE_KEYS.VIEW) as View) || "gradient";
	const points = JSON.parse(
		localStorage.getItem(LOCAL_STORAGE_KEYS.POINTS) || "[]",
	);

	return {
		mode,
		view,
		points,
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

const randomizeAction = (state: CanvasState) => {
	// Generate random points
	state.points = generateRandomPoints();
};

// Save program to localhost
// (changes will persist between page reloads)
const saveToLocalStorageAction = (state: CanvasState) => {
	// Save program snapshot to local storage
	localStorage.setItem(
		LOCAL_STORAGE_KEYS.POINTS,
		JSON.stringify(state.points),
	);
	localStorage.setItem(LOCAL_STORAGE_KEYS.VIEW, state.view);
	localStorage.setItem(LOCAL_STORAGE_KEYS.MODE, state.mode);
};

const readImageAction = (state: CanvasState, action: PayloadAction<string>) => {
	try {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();

		const handleImageLoad = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx?.drawImage(img, 0, 0);

			const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
			if (!imageData) throw new Error("Failed to read image data.");

			// Pixel data (Uint8ClampedArray)
			const pixels = imageData.data;
			console.log("pixels", pixels);

			// Get

			// Update your state with the new image data
			// state.image = modifiedDataUrl;
		};

		img.onload = handleImageLoad;
		img.src = action.payload;
	} catch (error) {
		console.log("Failed to read image.", error);
		throw new Error("Failed to read image.");
	}
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
		randomize: randomizeAction,
		saveToLocalStorage: saveToLocalStorageAction,
		readImage: readImageAction,
	},
});

export const {
	addPoint,
	clearPoints,
	erasePoints,
	randomize,
	setMode,
	setView,
	saveToLocalStorage,
	readImage,
} = canvasSlice.actions;

export default canvasSlice.reducer;
