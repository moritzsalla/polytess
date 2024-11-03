import { createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { editorActions } from "../store/editorSlice";

const selectEditorVisibility = createSelector(
	(state: RootState) => state.editor.menu.isVisible,
	(canvas) => canvas,
);

export const useEditorVisibility = () => {
	const dispatch = useDispatch();
	const isEditorVisible = useSelector(selectEditorVisibility);

	return {
		isEditorVisible,
		toggleEditorVisibility: () =>
			dispatch(editorActions.toggleEditorVisibility()),
	};
};
