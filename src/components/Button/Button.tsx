import css from "./Button.module.css";

const Button = ({
	children,
	onClick,
}: {
	children: React.ReactNode;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
	return (
		<button type='button' className={css.root} onClick={onClick}>
			{children}
		</button>
	);
};

export default Button;
