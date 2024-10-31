import { createSlice } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_KEYS } from "../config/storage";
import { store } from "../utils/storage";

export type ThemeState = {
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

// Attempt to retrieve the program state from local storage.
// If no state is found, return hardcoded defaults.
const getInitialTheme = (): ThemeValue => {
	const storedTheme = store.get("theme") as ThemeValue;
	return storedTheme ?? "light";
};

// Save program to local storage
// (changes will persist between page reloads)
const saveToLocalStorage = (state: ThemeState) => {
	store.put(LOCAL_STORAGE_KEYS.THEME, state.value);
};

const initialState: ThemeState = {
	// Get the theme from local storage, or default to light theme
	value: getInitialTheme(),
};

const invertTheme = (state: ThemeState) => {
	// Swap between light and dark theme
	state.value = state.value === "light" ? "dark" : "light";
	applyTheme(state.value);
};

const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		invertTheme,
		saveToLocalStorage,
	},
});

export const { ...themeActions } = themeSlice.actions;
export default themeSlice.reducer;

applyTheme(initialState.value);
