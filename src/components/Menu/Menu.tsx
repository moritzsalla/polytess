import css from "./Menu.module.css";
import Button from "../Button/Button";
import { useDispatch } from "react-redux";
import { useState, useMemo, useRef, useEffect } from "react";
import MenuPanel from "./MenuPanel/MenuPanel";
import { createMenuConfig } from "./createMenuConfig";
import { useCanvas } from "../../hooks/useCanvas";
import { useMaxEdgeLength } from "../../hooks/useMaxEdgeLength";
import { useEditorPosition } from "../../hooks/useEditorPosition";
import { useEditorVisibility } from "../../hooks/useEditorVisibility";

const Menu = () => {
	// We use this to track any possible async calls that might live longer
	// than the component itself.
	const cleanupRefRegistry = useRef<Array<() => void>>([]);

	const [isSaved, setIsSaved] = useState(false);
	const { isEditorVisible, toggleEditorVisibility } = useEditorVisibility();
	const { editorPosition, toggleEditorPosition } = useEditorPosition();

	const dispatch = useDispatch();
	const canvas = useCanvas();
	const maxEdgeLength = useMaxEdgeLength();

	const menuConfig = useMemo(() => {
		return Object.entries(
			// TODO -- flow here is messy, consider refactoring.
			createMenuConfig(
				canvas,
				dispatch,
				isSaved,
				setIsSaved,
				maxEdgeLength,
				cleanupRefRegistry.current,
			),
		);
	}, [canvas, dispatch, isSaved, maxEdgeLength]);

	// Cleanup registered fns on component unmount
	useEffect(() => {
		const cleanupRegistry = cleanupRefRegistry.current;
		return () => {
			cleanupRegistry.forEach((cleanup) => cleanup());
		};
	}, []);

	const handleVisibilityChange = () => {
		toggleEditorVisibility();
	};

	const handlePositionChange = () => {
		toggleEditorPosition();
	};

	return (
		<menu className={css.wrapper} data-position={editorPosition}>
			{isEditorVisible && (
				<div className={css.inner}>
					{menuConfig.map(([title, inputs], index) => (
						<MenuPanel
							key={`${title}-${inputs.length}_${index}`}
							title={title}
							inputs={inputs}
						/>
					))}
				</div>
			)}

			<div className={css.overlay}>
				<Button onClick={handleVisibilityChange}>
					{isEditorVisible ? "hide" : "show"} controls
				</Button>
				<Button onClick={handlePositionChange}>
					move menu to {editorPosition === "bottom" ? "top" : "bottom"}
				</Button>
			</div>
		</menu>
	);
};

export default Menu;
