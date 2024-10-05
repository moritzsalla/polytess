export const VIEWS = [
	{ name: "lines" },
	{ name: "shapes" },
	{ name: "gradient" },
	{ name: "imageTrace" },
] as const;

export type View = (typeof VIEWS)[number]["name"];
