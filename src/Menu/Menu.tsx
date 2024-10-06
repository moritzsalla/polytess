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
		<menu style={{ position: "fixed", bottom: 0, right: 0, padding: "1rem" }}>
			<AppearancePanel />
			<ViewPanel {...props} />
		</menu>
	);
};

const AppearancePanel = () => {
	return (
		<div style={{ padding: "1rem" }}>
			<Button onClick={() => invertAppTheme()}>Invert background</Button>
		</div>
	);
};

const ViewPanel = ({
	view,
	setView,
	onExport,
	onClear,
	onGenerate,
}: MenuProps) => {
	return (
		<div style={{ padding: "1rem" }}>
			<span>Current view: {view}</span>
			<div>
				View:{" "}
				{VIEWS.map(({ name }, index) => (
					<Button key={index + name} onClick={() => setView(name)}>
						{name}
					</Button>
				))}
			</div>
			<div>
				<Button onClick={onExport}>Export SVG</Button>
			</div>
			<div>
				<Button onClick={onClear}>Clear SVG</Button>
			</div>
			<div>
				<Button onClick={onGenerate}>Generate random points</Button>
			</div>
		</div>
	);
};

export default Menu;
