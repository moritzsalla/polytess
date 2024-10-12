import Button, { type ButtonProps } from "../../Button/Button";
import InputFile, { type InputFileProps } from "../../InputFile/InputFile";
import Range, { type RangeProps } from "../../Range/Range";
import css from "./MenuPanel.module.css";

const adaptButton = ({
	label,
	...rest
}: Omit<ButtonProps, "children"> & {
	label: string;
}) => <Button {...rest}>{label}</Button>;

const adaptColor = ({
	label,
	onChange,
}: {
	label: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => <input type='color' onChange={onChange} />;

const PANEL_INPUTS = {
	button: adaptButton,
	color: adaptColor,
	file: (props: InputFileProps) => <InputFile {...props} />,
	range: (props: RangeProps) => <Range {...props} />,
} as const;

type PanelInputType = keyof typeof PANEL_INPUTS;

type InputConfig = {
	[K in PanelInputType]: {
		type: K;
	} & Parameters<(typeof PANEL_INPUTS)[K]>[0];
}[PanelInputType];

export type InputsConfig = Array<InputConfig>;

type MenuPanelProps = {
	title: string;
	inputs: InputsConfig;
};

const MenuPanel = ({ title, inputs }: MenuPanelProps) => {
	return (
		<div className={css.panel}>
			<h2>({title})</h2>
			<div className={css.grid}>
				{inputs.map((input, index) => {
					// Get the correct input component based on the type
					const InputEl = PANEL_INPUTS[input.type] as (
						props: any,
					) => JSX.Element;
					// We have to loosen the type here temporarily because of Typescript
					// limitations with object accessors.

					const { type, ...props } = input;
					return <InputEl key={`input-${type}_${index}`} {...props} />;
				})}
			</div>
		</div>
	);
};

export default MenuPanel;
