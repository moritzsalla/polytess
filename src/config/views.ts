export const VIEWS = [
	{ name: "lines" },
	{ name: "gradient" },
	{ name: "vertex" },
	{ name: "pattern" },
	{ name: "image" },
] as const;

export type View = (typeof VIEWS)[number]["name"];
