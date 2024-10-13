import css from "./InputColor.module.css";
import { useId } from "react";

const InputColor = ({
	label,
	value,
	onChange,
}: React.InputHTMLAttributes<HTMLInputElement> & {
	label: string;
}) => {
	const id = useId();

	return (
		<div className={css.wrapper}>
			<label htmlFor={id} className={css.label}>
				{label}
			</label>
			<input
				type='color'
				id={id}
				value={value}
				className={css.input}
				onChange={onChange}
			/>
		</div>
	);
};

export default InputColor;
