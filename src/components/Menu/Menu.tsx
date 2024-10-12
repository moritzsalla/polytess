import css from "./Menu.module.css";
import Button from "../Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { useState, useMemo } from "react";
import type { RootState } from "../../store";
import MenuPanel from "./MenuPanel/MenuPanel";
import { createMenuConfig } from "./createMenuConfig";

const Menu = () => {
	const [showControls, setShowControls] = useState(true);
	const [isSaved, setIsSaved] = useState(false);

	const dispatch = useDispatch();
	const view = useSelector<RootState, RootState["canvas"]["view"]>(
		(state) => state.canvas.view,
	);
	const maxEdgeLength = useSelector<
		RootState,
		RootState["canvas"]["maxEdgeLength"]
	>((state) => state.canvas.maxEdgeLength);

	const menuConfig = useMemo(
		() =>
			createMenuConfig(view, dispatch, isSaved, setIsSaved, maxEdgeLength),
		[dispatch, view, isSaved, maxEdgeLength],
	);

	return (
		<menu className={css.wrapper}>
			{showControls && (
				<div className={css.inner}>
					{Object.entries(menuConfig).map(([title, inputs]) => (
						<MenuPanel key={title} title={title} inputs={inputs} />
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
