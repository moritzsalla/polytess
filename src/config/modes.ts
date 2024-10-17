export const MODES = [
	{ name: "draw" },
	{ name: "erase" },
	{ name: "edit" },
] as const;

export type Mode = (typeof MODES)[number]["name"];
