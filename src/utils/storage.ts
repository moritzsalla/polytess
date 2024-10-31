// **********************
// LOCAL STORAGE
// **********************

import {
	LOCAL_STORAGE_IDENTIFIER,
	type LocalStorageKey,
} from "../config/storage";

export const store = {
	/**
	 * Retrieve a key-value pair from local storage.
	 *
	 * @param key - The key to retrieve the value for.
	 * @returns The value stored under the key, or undefined if no value is found.
	 * @template T - The type of the value stored under the key.
	 *
	 * @example
	 * ```ts
	 * const theme = store.get("theme");
	 * console.log(theme); // "light" | "dark" | undefined
	 * ```
	 */
	get: <T>(key?: LocalStorageKey) => {
		const storedState = localStorage.getItem(LOCAL_STORAGE_IDENTIFIER);
		if (!storedState) {
			return undefined;
		}

		const parsed = JSON.parse(storedState) as Record<string, unknown>;
		if (key) {
			return parsed[key] as T;
		} else {
			return parsed as T;
		}
	},
	/**
	 * Save a key-value pair to local storage.
	 *
	 * @param key - The key to save the value under.
	 * @param state - The value to save.
	 * @returns void
	 *
	 * @example
	 * ```ts
	 * store.put("theme", "dark");
	 * ```
	 */
	put: (key: LocalStorageKey, state: unknown) => {
		localStorage.setItem(
			LOCAL_STORAGE_IDENTIFIER,
			JSON.stringify({
				...store.get(),
				[key]: state,
			}),
		);
	},
};
