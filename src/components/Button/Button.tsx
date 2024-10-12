import css from "./Button.module.css";

export type ButtonProps = {
	children: React.ReactNode;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const Button = ({ children, onClick }: ButtonProps) => {
	return (
		<button type='button' className={css.root} onClick={onClick}>
			{children}
		</button>
	);
};

export default Button;
