export const MODES = [{ name: "draw" }, { name: "erase" }] as const;

export const VIEWS = [
	{ name: "lines" },
	{ name: "shapes" },
	{ name: "gradient" },
	{ name: "imageTrace" },
] as const;

export type Mode = (typeof MODES)[number]["name"];
export type View = (typeof VIEWS)[number]["name"];

const LOCAL_STORAGE_PREFIX = "svg-drawing-";

export const STORAGE_KEYS = {
	VIEW: "svg-drawing-view",
	POINTS: "svg-drawing-points",
	MODE: "svg-drawing-mode",
	THEME: "svg-drawing-theme",
} as const satisfies Record<string, `${typeof LOCAL_STORAGE_PREFIX}${string}`>;

export const ERASE_MODE_RADIUS = 60;
