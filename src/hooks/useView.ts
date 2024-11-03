import type { RootState } from "../store";
import { useSelector } from "react-redux";

export const useView = () => {
	return useSelector((state: RootState) => state.canvas.view);
};
