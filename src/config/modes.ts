export const MODES = [
	{ name: "draw" },
	{ name: "erase" },
	{ name: "erase (snapshot)" },
] as const;

export type Mode = (typeof MODES)[number]["name"];
