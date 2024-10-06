import css from "./Menu.module.css";
import Button from "../Button/Button";
import { VIEWS, type View } from "../config";
import { invertAppTheme } from "./utils";

type MenuProps = {
	view: View;
	setView: (view: View) => void;
	onExport: () => void;
	onClear: () => void;
	onGenerate: () => void;
};

const Menu = (props: MenuProps) => {
	return (
		<menu className={css.wrapper}>
			<AppearancePanel />
			<ViewPanel {...props} />
			<ExportPanel {...props} />
		</menu>
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

const ViewPanel = ({ view, setView }: MenuProps) => {
	return (
		<div className={css.panel}>
			<h2>View ({view})</h2>
			<div>
				{VIEWS.map(({ name }, index) => (
					<Button key={index + name} onClick={() => setView(name)}>
						{name}
					</Button>
				))}
			</div>
		</div>
	);
};

const ExportPanel = ({ onExport, onClear, onGenerate }: MenuProps) => {
	return (
		<div className={css.panel}>
			<h2>Export</h2>
			<div>
				<Button onClick={onExport}>Export SVG</Button>
				<Button onClick={onClear}>Clear SVG</Button>
				<Button onClick={onGenerate}>Generate random points</Button>
			</div>
		</div>
	);
};

export default Menu;
