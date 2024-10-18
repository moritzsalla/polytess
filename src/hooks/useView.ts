import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { useSelector } from "react-redux";

const selectView = createSelector(
	(state: RootState) => state.canvas.view,
	(view) => view,
);

export const useView = () => {
	return useSelector(selectView);
};
