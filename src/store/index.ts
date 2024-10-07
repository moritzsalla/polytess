import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import canvasReducer from "./canvasSlice";

export const store = configureStore({
	reducer: {
		theme: themeReducer,
		canvas: canvasReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
