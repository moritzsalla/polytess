import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { editorActions } from "../store/editorSlice";

export const useEditorVisibility = () => {
	const dispatch = useDispatch();
	const isEditorVisible = useSelector(
		(state: RootState) => state.editor.menu.isVisible,
	);

	return {
		isEditorVisible,
		toggleEditorVisibility: () =>
			dispatch(editorActions.toggleEditorVisibility()),
	};
};
