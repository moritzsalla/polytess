import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

const selectMaxEdgeWidth = createSelector(
	(state: RootState) => state.canvas.maxEdgeLength,
	(maxEdgeLength) => maxEdgeLength,
);

export const useMaxEdgeLength = () => {
	return useSelector(selectMaxEdgeWidth);
};
