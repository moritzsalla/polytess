import type { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { VIEWS, type View } from "../../config/views";
import type { InputsConfig } from "./MenuPanel/MenuPanel";
import { MODES } from "../../config/modes";
import * as canvasSlice from "../../store/canvasSlice";
import * as themeSlice from "../../store/themeSlice";
import { downloadSvgFile } from "../utils/svg";

export const createMenuConfig = (
	view: View,
	dispatch: Dispatch<UnknownAction>,
	isSaved: boolean,
	setIsSaved: (value: boolean) => void,
) => {
	const baseConfig: Record<string, InputsConfig> = {
		Mode: MODES.map(({ name }) => ({
			type: "button" as const,
			label: name,
			onClick: () => dispatch(canvasSlice.setMode(name)),
		})),
		View: VIEWS.map(({ name }) => ({
			type: "button" as const,
			label: name,
			onClick: () => dispatch(canvasSlice.setView(name)),
		})),
		Controls: [
			{
				type: "button" as const,
				label: "randomize",
				onClick: () => dispatch(canvasSlice.generatePoints()),
			},
			{
				type: "button" as const,
				label: "clear",
				onClick: () => dispatch(canvasSlice.clearPoints()),
			},
		],
		Theme: [
			{
				type: "button" as const,
				label: "invert",
				onClick: () => dispatch(themeSlice.invertTheme()),
			},
		],
		Export: [
			{
				type: "button" as const,
				label: isSaved ? "saved!" : "save",
				onClick: () => {
					dispatch(canvasSlice.saveToLocalStorage());
					dispatch(themeSlice.saveToLocalStorage());
					setIsSaved(true);
					setTimeout(() => setIsSaved(false), 2000);
				},
			},
			{
				type: "button" as const,
				label: "export",
				onClick: () => {
					const svgElement = document.querySelector("svg");
					if (svgElement) {
						downloadSvgFile(svgElement, "export");
					}
				},
			},
		],
	};

	// View-specific controls
	if (view === "image") {
		baseConfig.Controls.unshift({
			type: "file",
			label: "upload image",
			onChange: (e) => {
				alert("Not implemented yet");
			},
		});
	}

	return baseConfig;
};
