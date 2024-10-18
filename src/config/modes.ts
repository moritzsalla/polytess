export const MODES = [
	{ name: "draw" },
	{ name: "erase (vertices)" },
	{ name: "erase (faces)" },
] as const;

export type Mode = (typeof MODES)[number]["name"];
