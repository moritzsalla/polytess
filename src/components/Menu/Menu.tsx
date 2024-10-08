import css from "./Menu.module.css";
import Button from "../Button/Button";
import { MODES } from "../../config";
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
import { useState } from "react";
import { VIEWS } from "../SvgCanvas/renderers";
import { downloadSvgFile } from "../utils/svg";
import type { RootState } from "../../store";

const Menu = () => {
	const [showControls, setShowControls] = useState(true);

	return (
		<menu className={css.wrapper}>
			{showControls && <Controls />}

			<div className={css.overlay}>
				<Button onClick={() => setShowControls((state) => !state)}>
					{showControls ? "hide" : "show"}
				</Button>
			</div>
		</menu>
	);
};

const Controls = () => {
	const dispatch = useDispatch();
	const [saved, setSaved] = useState(false);

	const view = useSelector<RootState, RootState["canvas"]["view"]>(
		(state) => state.canvas.view,
	);

	const controls = [] as PanelButtonsConfig;

	if (view === "gradient") {
		// View specific controls
	}

	return (
		<div className={css.inner}>
			<Panel
				title='Mode'
				buttons={MODES.map(({ name }) => ({
					label: name,
					onClick: () => dispatch(setMode(name)),
				}))}
			/>
			<Panel
				title='View'
				buttons={VIEWS.map(({ name }) => ({
					label: name,
					onClick: () => dispatch(setView(name)),
				}))}
			/>
			<Panel
				title='Controls'
				buttons={[
					...controls,
					{
						label: "random",
						onClick: () => dispatch(generatePoints()),
					},
					{
						label: "clear",
						onClick: () => dispatch(clearPoints()),
					},
				]}
			/>
			<Panel
				title='Theme'
				buttons={[
					{ label: "invert", onClick: () => dispatch(invertTheme()) },
				]}
			/>
			<Panel
				title='Export'
				buttons={[
					{
						label: saved ? "saved!" : "save",
						onClick: () => {
							// Save current state of program to localhost
							// to persist changes between page reloads.
							dispatch(themeSaveToLocalStorage());
							dispatch(canvasSaveToLocalStorage());
							// Show "Saved!" for 2 seconds
							setSaved(true);
							setTimeout(() => setSaved(false), 2000);
						},
					},
					{
						label: "export",
						onClick: () => {
							const svgElement = document.querySelector("svg");
							if (svgElement) {
								downloadSvgFile(svgElement, "export");
							}
						},
					},
				]}
			/>
		</div>
	);
};

type PanelButtonsConfig = Array<{ label: string; onClick: () => void }>;

const Panel = ({
	title,
	buttons,
}: {
	title: string;
	buttons: PanelButtonsConfig;
}) => {
	return (
		<div className={css.panel}>
			<h2>({title})</h2>
			<div className={css.grid}>
				{buttons.map(({ label, onClick }, index) => (
					<Button key={`${index}${label}`} onClick={onClick}>
						{label}
					</Button>
				))}
			</div>
		</div>
	);
};

export default Menu;
