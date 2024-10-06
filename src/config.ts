export const VIEWS = [
	{ name: "lines" },
	{ name: "shapes" },
	{ name: "gradient" },
	{ name: "imageTrace" },
] as const;

export const STORAGE_KEYS = {
	VIEW: "view",
	POINTS: "points",
	THEME_INVERTED: "themeInverted",
} as const;

export type View = (typeof VIEWS)[number]["name"];
