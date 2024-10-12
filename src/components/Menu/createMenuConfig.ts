import type { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { VIEWS, type View } from "../../config/views";
import type { InputsConfig } from "./MenuPanel/MenuPanel";
import { MODES } from "../../config/modes";
import { canvasActions } from "../../store/canvasSlice";
import { themeActions } from "../../store/themeSlice";
import { downloadSvgFile } from "../../utils/svg";

type PanelMap = Record<string, InputsConfig>;
type CreateMenuConfig = (
	view: View,
	dispatch: Dispatch<UnknownAction>,
	isSaved: boolean,
	setIsSaved: (value: boolean) => void,
	maxEdgeLength: number,
) => PanelMap;

export const createMenuConfig: CreateMenuConfig = (
	view,
	dispatch,
	isSaved,
	setIsSaved,
	maxEdgeLength,
) => {
	const baseConfig: PanelMap = {
		Mode: MODES.map(({ name }) => ({
			type: "button",
			label: name,
			onClick: () => dispatch(canvasActions.setMode(name)),
		})),

		View: VIEWS.map(({ name }) => ({
			type: "button",
			label: name,
			onClick: () => dispatch(canvasActions.setView(name)),
		})),

		Controls: [
			{
				type: "button",
				label: "randomize",
				onClick: () => dispatch(canvasActions.randomize()),
			},
			{
				type: "button",
				label: "clear",
				onClick: () => dispatch(canvasActions.clearPoints()),
			},
			{
				type: "range",
				label: "max edge length",
				min: 10,
				max: 500,
				value: maxEdgeLength,
				onChange: (e) =>
					dispatch(
						canvasActions.setMaxEdgeLength(parseInt(e.target.value)),
					),
			},
		],

		Theme: [
			{
				type: "button",
				label: "invert",
				onClick: () => dispatch(themeActions.invertTheme()),
			},
		],

		Export: [
			{
				type: "button",
				label: isSaved ? "saved!" : "save",
				onClick: () => {
					dispatch(canvasActions.saveToLocalStorage());
					dispatch(themeActions.saveToLocalStorage());
					setIsSaved(true);
					setTimeout(() => setIsSaved(false), 2000);
				},
			},
			{
				type: "button",
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
						dispatch(canvasActions.readImage(reader.result as string));
					};
					reader.readAsDataURL(file);
				}
			},
		});
	}

	return baseConfig;
};
