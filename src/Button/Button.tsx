import css from "./Button.module.css";

const Button = ({
	children,
	onClick,
}: {
	children: React.ReactNode;
	onClick: () => void;
}) => {
	return (
		<button type='button' className={css.root} onClick={onClick}>
			{children}
		</button>
	);
};

export default Button;
