import css from "./Menu.module.css";
import Button from "../Button/Button";
import { MODES, VIEWS } from "../../config";
import { invertAppTheme } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { downloadSvgFile } from "../../utils";
import {
	clearPoints,
	generatePoints,
	setMode,
	setView,
} from "../../store/canvasSlice";

const Menu = () => {
	return (
		<menu className={css.wrapper}>
			<DrawingModePanel />
			<AppearancePanel />
			<ViewPanel />
			<ExportPanel />
		</menu>
	);
};

const DrawingModePanel = () => {
	const dispatch = useDispatch();
	const { mode } = useSelector<RootState, RootState["canvas"]>(
		(state) => state.canvas,
	);

	return (
		<div className={css.panel}>
			<h2>Drawing mode ({mode})</h2>
			<div>
				{MODES.map(({ name }, index) => (
					<Button
						key={`${index}${name}`}
						onClick={() => dispatch(setMode(name))}
					>
						{name}
					</Button>
				))}
			</div>
		</div>
	);
};

const AppearancePanel = () => {
	return (
		<div className={css.panel}>
			<h2>Appearance</h2>
			<Button onClick={() => invertAppTheme()}>Invert background</Button>
		</div>
	);
};

const ViewPanel = () => {
	const dispatch = useDispatch();
	const { view } = useSelector<RootState, RootState["canvas"]>(
		(state) => state.canvas,
	);

	return (
		<div className={css.panel}>
			<h2>View ({view})</h2>
			<div>
				{VIEWS.map(({ name }, index) => (
					<Button
						key={`${index}${name}`}
						onClick={() => dispatch(setView(name))}
					>
						{name}
					</Button>
				))}
			</div>
		</div>
	);
};

const ExportPanel = () => {
	const dispatch = useDispatch();

	const handleExportSVG = () => {
		const svgElement = document.querySelector("svg");
		if (svgElement) {
			downloadSvgFile(svgElement, "export");
		}
	};

	return (
		<div className={css.panel}>
			<h2>Export</h2>
			<div>
				<Button onClick={handleExportSVG}>Export SVG</Button>
				<Button onClick={() => dispatch(clearPoints())}>Clear SVG</Button>
				<Button onClick={() => dispatch(generatePoints())}>
					Generate random points
				</Button>
			</div>
		</div>
	);
};

export default Menu;
