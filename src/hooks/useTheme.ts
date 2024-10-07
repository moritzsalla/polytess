import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const useTheme = () =>
	useSelector<RootState, RootState["theme"]>((state) => state.theme);
