// src/store/canvasSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "../config";

export type ProgramTheme = "light" | "dark";
type ThemeState = {
	theme: ProgramTheme;
};

const applyTheme = (theme: ProgramTheme) => {
	const root = document.documentElement;
	if (theme === "dark") {
		root.style.setProperty("--color-primary", "#000000");
		root.style.setProperty("--color-secondary", "#ffffff");
	} else {
		root.style.setProperty("--color-primary", "#ffffff");
		root.style.setProperty("--color-secondary", "#000000");
	}
};

const getInitialTheme = (): ProgramTheme => {
	const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ProgramTheme;
	console.log(storedTheme);
	return storedTheme || "light";
};

const initialState: ThemeState = {
	theme: getInitialTheme(),
};

const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		invertTheme: (state) => {
			state.theme = state.theme === "light" ? "dark" : "light";
			localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
			applyTheme(state.theme);
		},
	},
});

export const { invertTheme } = themeSlice.actions;

export default themeSlice.reducer;

applyTheme(initialState.theme);
