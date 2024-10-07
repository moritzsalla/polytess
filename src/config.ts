export const MODES = [{ name: "draw" }, { name: "erase" }] as const;

export const VIEWS = [
	{ name: "lines" },
	{ name: "shapes" },
	{ name: "gradient" },
	{ name: "imageTrace" },
] as const;

export type Mode = (typeof MODES)[number]["name"];
export type View = (typeof VIEWS)[number]["name"];

export const STORAGE_KEYS = {
	VIEW: "view",
	POINTS: "points",
	MODE: "mode",
	THEME: "theme",
} as const;

export const ERASE_MODE_RADIUS = 60;
