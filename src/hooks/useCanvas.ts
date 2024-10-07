import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const useCanvas = () =>
	useSelector<RootState, RootState["canvas"]>((state) => state.canvas);
