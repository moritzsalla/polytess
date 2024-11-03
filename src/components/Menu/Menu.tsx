import css from "./Menu.module.css";
import Button from "../Button/Button";
import { useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import MenuPanel from "./MenuPanel/MenuPanel";
import { createMenuConfig } from "./createMenuConfig";
import { useCanvas } from "../../hooks/useCanvas";
import { useMaxEdgeLength } from "../../hooks/useMaxEdgeLength";
import { useEditorPosition } from "../../hooks/useEditorPosition";
import { useEditorVisibility } from "../../hooks/useEditorVisibility";

const Menu = () => {
	const [isSaved, setIsSaved] = useState(true);
	const { isEditorVisible, toggleEditorVisibility } = useEditorVisibility();
	const { editorPosition, toggleEditorPosition } = useEditorPosition();

	const dispatch = useDispatch();
	const canvas = useCanvas();
	const maxEdgeLength = useMaxEdgeLength();

	const menuConfig = useMemo(
		() =>
			Object.entries(
				createMenuConfig(
					canvas,
					dispatch,
					isSaved,
					setIsSaved,
					maxEdgeLength,
				),
			),
		[canvas, dispatch, isSaved, maxEdgeLength],
	);

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
