import css from "./InputFile.module.css";
import { useId } from "react";

const ACCEPT = "image/*";

export type InputFileProps = {
	label: string;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const InputFile = ({ label, onChange }: InputFileProps) => {
	const id = useId();

	return (
		<div>
			<label htmlFor={id} className={css.button}>
				{label}
			</label>
			<input
				id={id}
				type='file'
				accept={ACCEPT}
				className={css.input}
				onChange={onChange}
			/>
		</div>
	);
};

export default InputFile;
