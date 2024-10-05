const Button = ({
	children,
	onClick,
}: {
	children: React.ReactNode;
	onClick: () => void;
}) => {
	return (
		<button type='button' onClick={onClick}>
			{children}
		</button>
	);
};

export default Button;
