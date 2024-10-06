import { useState, useEffect } from "react";

const saveToLocalStorage = (key: string, value: any) => {
	try {
		const serializedValue = JSON.stringify(value);
		localStorage.setItem(key, serializedValue);
	} catch (error) {
		console.error("Error saving to localStorage:", error);
	}
};

const loadFromLocalStorage = (key: string) => {
	try {
		const serializedValue = localStorage.getItem(key);
		if (serializedValue === null) {
			return undefined;
		}
		return JSON.parse(serializedValue);
	} catch (error) {
		console.error("Error loading from localStorage:", error);
		return undefined;
	}
};

export const usePersistentState = <T>(key: string, initialValue: T) => {
	const [state, setState] = useState<T>(() => {
		const savedState = loadFromLocalStorage(key);
		return savedState !== undefined ? savedState : initialValue;
	});

	useEffect(() => {
		saveToLocalStorage(key, state);
	}, [key, state]);

	return [state, setState] as const;
};
