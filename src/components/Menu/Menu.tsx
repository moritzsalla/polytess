import css from "./Menu.module.css";
import Button from "../Button/Button";
import { useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import MenuPanel from "./MenuPanel/MenuPanel";
import { createMenuConfig } from "./createMenuConfig";
import { useCanvas } from "../../hooks/useCanvas";
import { useMaxEdgeLength } from "../../hooks/useMaxEdgeLength";

type MenuPosition = "top" | "bottom";

const Menu = () => {
	const [showControls, setShowControls] = useState(true);
	const [isSaved, setIsSaved] = useState(false);
	const [menuPosition, setMenuPosition] = useState<MenuPosition>("top");

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
		setShowControls((state) => !state);
	};

	const handlePositionChange = () => {
		setMenuPosition((state) => (state === "bottom" ? "top" : "bottom"));
	};

	return (
		<menu className={css.wrapper} data-position={menuPosition}>
			{showControls && (
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
					{showControls ? "hide" : "show"} controls
				</Button>
				<Button onClick={handlePositionChange}>
					move menu to {menuPosition === "bottom" ? "top" : "bottom"}
				</Button>
			</div>
		</menu>
	);
};

export default Menu;
