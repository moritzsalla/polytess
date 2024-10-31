// **********************
// LOCAL STORAGE
// **********************

export const LOCAL_STORAGE_IDENTIFIER = "_delaunay-svg-program-saved-state";
export const LOCAL_STORAGE_KEYS = {
	VIEW: "view",
	POINTS: "points",
	MODE: "mode",
	THEME: "theme",
	MAX_EDGE_LENGTH: "max-edge-length",
	GRADIENT_COLOR_START: "gradient-color-start",
	GRADIENT_COLOR_END: "gradient-color-end",
} as const satisfies Record<string, string>;

export type LocalStorageKey =
	(typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS];
