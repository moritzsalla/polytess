export type RangeProps = {
	label: string;
	min: number;
	step?: number;
	max: number;
	value: number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Range = ({ label, min, step, max, value, onChange }: RangeProps) => {
	return (
		<div>
			<label>{label}</label>
			<input
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

export default Range;
