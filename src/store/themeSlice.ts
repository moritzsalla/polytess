// src/store/canvasSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_KEYS } from "../config/local-storage";

type ThemeState = {
	value: "light" | "dark";
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
};

// Save program to localhost
// (changes will persist between page reloads)
const saveToLocalStorageAction = (state: ThemeState) => {
	// Save program snapshot to local storage
	localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, state.value);
};

const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		invertTheme: (state) => {
			state.value = state.value === "light" ? "dark" : "light";
			applyTheme(state.value);
		},
		saveToLocalStorage: saveToLocalStorageAction,
	},
});

export const { ...themeActions } = themeSlice.actions;
export default themeSlice.reducer;

applyTheme(initialState.value);
