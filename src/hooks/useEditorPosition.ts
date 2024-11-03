import { createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { editorActions } from "../store/editorSlice";

const selectEditorPosition = createSelector(
	(state: RootState) => state.editor.menu.position,
	(canvas) => canvas,
);

export const useEditorPosition = () => {
	const dispatch = useDispatch();
	const editorPosition = useSelector(selectEditorPosition);

	return {
		editorPosition,
		toggleEditorPosition: () =>
			dispatch(editorActions.toggleEditorPosition()),
	};
};
