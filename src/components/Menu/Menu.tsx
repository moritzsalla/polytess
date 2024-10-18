import css from "./Menu.module.css";
import Button from "../Button/Button";
import { useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import MenuPanel from "./MenuPanel/MenuPanel";
import { createMenuConfig } from "./createMenuConfig";
import { useCanvas } from "../../hooks/useCanvas";
import { useMaxEdgeLength } from "../../hooks/useMaxEdgeLength";

const Menu = () => {
	const [showControls, setShowControls] = useState(true);
	const [isSaved, setIsSaved] = useState(false);

	const dispatch = useDispatch();
	const canvas = useCanvas();
	const maxEdgeLength = useMaxEdgeLength();

	const menuConfig = useMemo(
		() =>
			createMenuConfig(canvas, dispatch, isSaved, setIsSaved, maxEdgeLength),
		[canvas, dispatch, isSaved, maxEdgeLength],
	);

	return (
		<menu className={css.wrapper}>
			{showControls && (
				<div className={css.inner}>
					{Object.entries(menuConfig).map(([title, inputs], index) => (
						<MenuPanel
							key={`${title}-${inputs.length}_${index}`}
							title={title}
							inputs={inputs}
						/>
					))}
				</div>
			)}
			<div className={css.overlay}>
				<Button onClick={() => setShowControls((state) => !state)}>
					{showControls ? "hide" : "show"} controls
				</Button>
			</div>
		</menu>
	);
};

export default Menu;
