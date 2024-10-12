const LOCAL_STORAGE_PREFIX = "svg-drawing-";

export const LOCAL_STORAGE_KEYS = {
	VIEW: "svg-drawing-view",
	POINTS: "svg-drawing-points",
	MODE: "svg-drawing-mode",
	THEME: "svg-drawing-theme",
	MAX_EDGE_LENGTH: "svg-drawing-max-edge-length",
} as const satisfies Record<string, `${typeof LOCAL_STORAGE_PREFIX}${string}`>;
