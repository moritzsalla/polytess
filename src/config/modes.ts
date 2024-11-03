export const MODES = [
	{ key: "draw", name: "draw" },
	{ key: "eraseVertices", name: "erase points" },
	{ key: "eraseFaces", name: "erase shapes" },
] as const;

export type Mode = (typeof MODES)[number];
export type ModeName = Mode["name"];
export type ModeKey = Mode["key"];
