import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

const selectCanvas = createSelector(
	(state: RootState) => state.canvas,
	(canvas) => canvas,
);

export const useCanvas = () => {
	return useSelector(selectCanvas);
};
