import { lazy, Suspense } from "react";
import type { ButtonProps } from "../../Button/Button";
import css from "./MenuPanel.module.css";

const Button = lazy(() => import("../../Button/Button"));
const InputRange = lazy(() => import("../../InputRange/InputRange"));
const InputFile = lazy(() => import("../../InputFile/InputFile"));
const InputColor = lazy(() => import("../../InputColor/InputColor"));

const PANEL_INPUTS = {
	button: ({
		label,
		...rest
	}: Omit<ButtonProps, "children"> & {
		label: string;
	}) => <Button {...rest}>{label}</Button>,

	color: InputColor,
	file: InputFile,
	range: InputRange,
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
					return (
						<Suspense
							fallback={<div className={css.skeleton}>&nbsp;</div>}
						>
							<InputEl
								key={`inputs-${title}-${type}_${index}`}
								{...props}
							/>
						</Suspense>
					);
				})}
			</div>
		</div>
	);
};

export default MenuPanel;
