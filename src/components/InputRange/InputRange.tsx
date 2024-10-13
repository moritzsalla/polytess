import { useId } from "react";
import css from "./InputRange.module.css";

export type RangeProps = {
	label: string;
	min: number;
	step?: number;
	max: number;
	value: number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputRange = ({ label, min, step, max, value, onChange }: RangeProps) => {
	const id = useId();

	return (
		<div className={css.wrapper}>
			<label className={css.label} htmlFor={id}>
				{label}
			</label>
			<input
				id={id}
				className={css.input}
				type='range'
				min={min}
				step={step}
				max={max}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
};

export default InputRange;
