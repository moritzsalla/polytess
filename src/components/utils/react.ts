export const mergeRefs =
	<T extends any>(
		...refs: Array<React.Ref<T> | undefined>
	): React.RefCallback<T> =>
	(value) => {
		refs.forEach((ref) => {
			if (typeof ref === "function") {
				ref(value);
			} else if (ref) {
				(ref as React.MutableRefObject<T | null>).current = value;
			}
		});
	};
