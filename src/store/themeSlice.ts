// src/store/canvasSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_KEYS } from "../config/local-storage";

type ThemeState = {
	value: "light" | "dark";
	gradientStartColor: string;
	gradientEndColor: string;
};

type ThemeValue = ThemeState["value"];

const applyTheme = (theme: ThemeValue) => {
	const root = document.documentElement;
	if (theme === "dark") {
		root.style.setProperty("--color-primary", "#000000");
		root.style.setProperty("--color-secondary", "#ffffff");
	} else {
		root.style.setProperty("--color-primary", "#ffffff");
		root.style.setProperty("--color-secondary", "#000000");
	}
};

const getInitialTheme = (): ThemeValue => {
	const storedTheme = localStorage.getItem(
		LOCAL_STORAGE_KEYS.THEME,
	) as ThemeValue;
	return storedTheme || "light";
};

const initialState: ThemeState = {
	value: getInitialTheme(),
	gradientStartColor: "red",
	gradientEndColor: "blue",
};

const invertTheme = (state: ThemeState) => {
	state.value = state.value === "light" ? "dark" : "light";
	applyTheme(state.value);
};

// Save program to localhost
// (changes will persist between page reloads)
const saveToLocalStorage = (state: ThemeState) => {
	// Save program snapshot to local storage
	localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, state.value);
	localStorage.setItem(
		LOCAL_STORAGE_KEYS.GRADIENT_COLOR_START,
		state.gradientStartColor,
	);
	localStorage.setItem(
		LOCAL_STORAGE_KEYS.GRADIENT_COLOR_END,
		state.gradientEndColor,
	);
};

const setGradientStartColor = (
	state: ThemeState,
	action: { payload: string },
) => {
	state.gradientStartColor = action.payload;
};

const setGradientEndColor = (
	state: ThemeState,
	action: { payload: string },
) => {
	state.gradientEndColor = action.payload;
};

const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		invertTheme,
		saveToLocalStorage,
		setGradientStartColor,
		setGradientEndColor,
	},
});

export const { ...themeActions } = themeSlice.actions;
export default themeSlice.reducer;

applyTheme(initialState.value);
