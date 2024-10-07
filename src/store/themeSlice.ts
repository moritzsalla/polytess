// src/store/canvasSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "../config";


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
	const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeValue;
	console.log(storedTheme);
	return storedTheme || "light";
};

const initialState: ThemeState = {
	value: getInitialTheme(),
};

const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		invertTheme: (state) => {
			state.value = state.value === "light" ? "dark" : "light";
			localStorage.setItem(STORAGE_KEYS.THEME, state.value);
			applyTheme(state.value);
		},
	},
});

export const { invertTheme } = themeSlice.actions;

export default themeSlice.reducer;

applyTheme(initialState.value);
