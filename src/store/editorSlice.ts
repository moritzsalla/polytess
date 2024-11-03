import { createSlice } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_KEYS } from "../config/storage";
import { store } from "../utils/storage";

export type EditorState = {
	theme: {
		value: "light" | "dark";
	};
	menu: {
		isVisible: boolean;
		position: "top" | "bottom";
	};
};

type ThemeValue = EditorState["theme"]["value"];

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
const saveToLocalStorage = (state: EditorState) => {
	store.put(LOCAL_STORAGE_KEYS.THEME, state.theme.value);
};

const initialState: EditorState = {
	// Get the theme from local storage, or default to light theme
	theme: {
		value: getInitialTheme(),
	},
	menu: {
		isVisible: true,
		position: "top",
	},
};

const invertTheme = (state: EditorState) => {
	// Swap between light and dark theme
	state.theme.value = state.theme.value === "light" ? "dark" : "light";
	applyTheme(state.theme.value);
};

const toggleEditorPosition = (state: EditorState) => {
	// Swap between top and bottom menu position
	state.menu.position = state.menu.position === "top" ? "bottom" : "top";
};

const toggleEditorVisibility = (state: EditorState) => {
	state.menu.isVisible = !state.menu.isVisible;
};

const editorSlice = createSlice({
	name: "editor",
	initialState,
	reducers: {
		invertTheme,
		saveToLocalStorage,
		toggleEditorPosition,
		toggleEditorVisibility,
	},
});

export const { ...editorActions } = editorSlice.actions;
export default editorSlice.reducer;

applyTheme(initialState.theme.value);
