export const MODES = [{ name: "draw" }, { name: "erase" }] as const;

export type Mode = (typeof MODES)[number]["name"];
