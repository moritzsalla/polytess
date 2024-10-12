import type { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { VIEWS, type View } from "../../config/views";
import type { InputsConfig } from "./MenuPanel/MenuPanel";
import { MODES } from "../../config/modes";
import * as canvasSlice from "../../store/canvasSlice";
import * as themeSlice from "../../store/themeSlice";
import { downloadSvgFile } from "../../utils/svg";

type PanelMap = Record<string, InputsConfig>;
type CreateMenuConfig = (
	view: View,
	dispatch: Dispatch<UnknownAction>,
	isSaved: boolean,
	setIsSaved: (value: boolean) => void,
) => PanelMap;

export const createMenuConfig: CreateMenuConfig = (
	view: View,
	dispatch: Dispatch<UnknownAction>,
	isSaved: boolean,
	setIsSaved: (value: boolean) => void,
) => {
	const baseConfig: PanelMap = {
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
				onClick: () => dispatch(canvasSlice.randomize()),
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
					if (svgElement) downloadSvgFile(svgElement, "export");
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
				const file = e.target.files?.[0];
				if (file) {
					const reader = new FileReader();
					reader.onload = () => {
						dispatch(canvasSlice.readImage(reader.result as string));
					};
					reader.readAsDataURL(file);
				}
			},
		});
	}

	return baseConfig;
};
