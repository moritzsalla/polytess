import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { editorActions } from "../store/editorSlice";

export const useEditorPosition = () => {
	const dispatch = useDispatch();
	const editorPosition = useSelector(
		(state: RootState) => state.editor.menu.position,
	);

	return {
		editorPosition,
		toggleEditorPosition: () =>
			dispatch(editorActions.toggleEditorPosition()),
	};
};
