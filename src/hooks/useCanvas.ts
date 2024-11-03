import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const useCanvas = () => {
	return useSelector((state: RootState) => state.canvas);
};
