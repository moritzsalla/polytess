import css from "./Menu.module.css";
import Button from "../Button/Button";
import { useDispatch, useSelector } from "react-redux";
import {
	clearPoints,
	generatePoints,
	saveToLocalStorage as canvasSaveToLocalStorage,
	setMode,
	setView,
} from "../../store/canvasSlice";
import {
	invertTheme,
	saveToLocalStorage as themeSaveToLocalStorage,
} from "../../store/themeSlice";
import { useState, useMemo } from "react";
import { downloadSvgFile } from "../utils/svg";
import type { RootState } from "../../store";
import MenuPanel, { type InputsConfig } from "./MenuPanel/MenuPanel";
import type { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { VIEWS, type View } from "../../config/views";
import { MODES } from "../../config/modes";

const createMenuConfig = (
	view: View,
	dispatch: Dispatch<UnknownAction>,
	isSaved: boolean,
	setIsSaved: (value: boolean) => void,
) => {
	const baseConfig: Record<string, InputsConfig> = {
		Mode: MODES.map(({ name }) => ({
			type: "button" as const,
			label: name,
			onClick: () => dispatch(setMode(name)),
		})),
		View: VIEWS.map(({ name }) => ({
			type: "button" as const,
			label: name,
			onClick: () => dispatch(setView(name)),
		})),
		Controls: [
			{
				type: "button" as const,
				label: "randomize",
				onClick: () => dispatch(generatePoints()),
			},
			{
				type: "button" as const,
				label: "clear",
				onClick: () => dispatch(clearPoints()),
			},
		],
		Theme: [
			{
				type: "button" as const,
				label: "invert",
				onClick: () => dispatch(invertTheme()),
			},
		],
		Export: [
			{
				type: "button" as const,
				label: isSaved ? "saved!" : "save",
				onClick: () => {
					dispatch(themeSaveToLocalStorage());
					dispatch(canvasSaveToLocalStorage());
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

const Menu = () => {
	const [showControls, setShowControls] = useState(true);
	const [isSaved, setIsSaved] = useState(false);

	const dispatch = useDispatch();
	const view = useSelector<RootState, RootState["canvas"]["view"]>(
		(state) => state.canvas.view,
	);

	const menuConfig = useMemo(
		() => createMenuConfig(view, dispatch, isSaved, setIsSaved),
		[dispatch, view, isSaved],
	);

	return (
		<menu className={css.wrapper}>
			{showControls && (
				<div className={css.inner}>
					{Object.entries(menuConfig).map(([title, inputs]) => (
						<MenuPanel key={title} title={title} inputs={inputs} />
					))}
				</div>
			)}
			<div className={css.overlay}>
				<Button onClick={() => setShowControls((state) => !state)}>
					{showControls ? "hide" : "show"}
				</Button>
			</div>
		</menu>
	);
};

export default Menu;
