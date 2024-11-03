import type { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import type { InputsConfig } from "./MenuPanel/MenuPanel";
import { MODES } from "../../config/modes";
import { canvasActions, type CanvasState } from "../../store/canvasSlice";
import { editorActions } from "../../store/editorSlice";
import { downloadSvgFile } from "../../utils/svg";
import { VIEWS } from "../SvgCanvas/renderers";
import { loadAndProcessImage } from "../../utils/image";

type PanelMap = Record<string, InputsConfig>;
type CreateMenuConfig = (
	canvas: CanvasState,
	dispatch: Dispatch<UnknownAction>,
	isSaved: boolean,
	setIsSaved: (value: boolean) => void,
	maxEdgeLength: number,
) => PanelMap;

export const createMenuConfig: CreateMenuConfig = (
	canvas,
	dispatch,
	isSaved,
	setIsSaved,
	maxEdgeLength,
) => {
	const { view, gradient } = canvas;

	const baseConfig: PanelMap = {
		Mode: MODES.map(({ key, name }) => ({
			type: "button",
			label: name,
			onClick: () => dispatch(canvasActions.setMode(key)),
		})),

		View: VIEWS.map((view) => ({
			type: "button",
			label: view,
			onClick: () => dispatch(canvasActions.setView(view)),
		})),

		Controls: [
			{
				type: "file",
				label: "upload image",
				onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
					const file = e.target.files?.[0];
					if (file) {
						try {
							const points = await loadAndProcessImage(file);
							dispatch(canvasActions.setPoints(points));
						} catch (error) {
							console.error("Failed to process image:", error);
						}
					}
				},
			},
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
				label: "mesh density",
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
				label: "dark/light mode",
				onClick: () => dispatch(editorActions.invertTheme()),
			},
		],

		Export: [
			{
				type: "button",
				label: isSaved ? "saved!" : "save",
				onClick: () => {
					dispatch(canvasActions.saveToLocalStorage());
					dispatch(editorActions.saveToLocalStorage());
					setIsSaved(true);
					setTimeout(() => setIsSaved(false), 2000);
				},
			},
			{
				type: "button",
				label: "download SVG",
				onClick: () => {
					const svgElement = document.querySelector("svg");
					if (svgElement) downloadSvgFile(svgElement, "export");
				},
			},
			{
				type: "button",
				label: "copy SVG",
				onClick: () => {
					const svgElement = document.querySelector("svg");
					if (svgElement) {
						const svgData = new XMLSerializer().serializeToString(
							svgElement,
						);
						navigator.clipboard.writeText(svgData);
					}
				},
			},
		],
	};

	// View specific controls:
	if (view === "gradient") {
		// Gradient-Start color
		baseConfig.Controls.unshift({
			type: "color",
			label: "Gradient Start",
			value: gradient.startColor,
			onChange: (e) =>
				dispatch(canvasActions.setGradientStartColor(e.target.value)),
		});
		// Gradient-End color
		baseConfig.Controls.unshift({
			type: "color",
			label: "Gradient End",
			value: gradient.endColor,
			onChange: (e) =>
				dispatch(canvasActions.setGradientEndColor(e.target.value)),
		});
	}

	return baseConfig;
};
