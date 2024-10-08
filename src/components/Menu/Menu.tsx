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

	const controls = [] as PanelInputsConfig;

	if (view === "gradient") {
		// TODO View specific controls
	}

	return (
		<div className={css.inner}>
			<Panel
				title='Mode'
				inputs={MODES.map(({ name }) => ({
					type: "button",
					label: name,
					onClick: () => dispatch(setMode(name)),
				}))}
			/>
			<Panel
				title='View'
				inputs={VIEWS.map(({ name }) => ({
					type: "button",
					label: name,
					onClick: () => dispatch(setView(name)),
				}))}
			/>
			<Panel
				title='Controls'
				inputs={[
					...controls,
					{
						type: "button",
						label: "random",
						onClick: () => dispatch(generatePoints()),
					},
					{
						type: "button",
						label: "clear",
						onClick: () => dispatch(clearPoints()),
					},
				]}
			/>
			<Panel
				title='Theme'
				inputs={[
					{
						type: "button",
						label: "invert",
						onClick: () => dispatch(invertTheme()),
					},
				]}
			/>
			<Panel
				title='Export'
				inputs={[
					{
						type: "button",
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
						type: "button",
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

type PanelInputsConfig = Array<
	// Button
	| {
			type: "button";
			label: string;
			onClick: () => void;
	  }
	// Color picker
	| {
			type: "color";
			label: string;
			value: string;
			onChange: (value: string) => void;
	  }
>;

const Panel = ({
	title,
	inputs,
}: {
	title: string;
	inputs: PanelInputsConfig;
}) => {
	return (
		<div className={css.panel}>
			<h2>({title})</h2>
			<div className={css.grid}>
				{inputs.map((input, index) => {
					// TODO Add more input types

					if (input.type === "button") {
						const { label, onClick } = input;
						return (
							<Button key={`${index}${label}`} onClick={onClick}>
								{label}
							</Button>
						);
					}

					return null;
				})}
			</div>
		</div>
	);
};

export default Menu;
