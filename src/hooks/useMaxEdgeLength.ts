import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const useMaxEdgeLength = () => {
	return useSelector((state: RootState) => state.canvas.maxEdgeLength);
};
