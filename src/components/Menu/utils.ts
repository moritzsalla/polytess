export const invertAppTheme = () => {
	const computedStyle = getComputedStyle(document.documentElement);

	// Get current colors
	const currentPrimary = computedStyle
		.getPropertyValue("--color-primary")
		.trim();
	const currentSecondary = computedStyle
		.getPropertyValue("--color-secondary")
		.trim();

	// Swap
	document.documentElement.style.setProperty(
		"--color-primary",
		currentSecondary,
	);
	document.documentElement.style.setProperty(
		"--color-secondary",
		currentPrimary,
	);
};
