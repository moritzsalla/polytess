import css from "./Menu.module.css";
import Button from "../Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { useState, useMemo } from "react";
import type { RootState } from "../../store";
import MenuPanel from "./MenuPanel/MenuPanel";
import { createMenuConfig } from "./createMenuConfig";
import type { CanvasState } from "../../store/canvasSlice";

const Menu = () => {
	const [showControls, setShowControls] = useState(true);
	const [isSaved, setIsSaved] = useState(false);

	const dispatch = useDispatch();

	const canvas = useSelector<RootState, CanvasState>((state) => state.canvas);
	const maxEdgeLength = useSelector<
		RootState,
		RootState["canvas"]["maxEdgeLength"]
	>((state) => state.canvas.maxEdgeLength);

	const menuConfig = useMemo(
		() =>
			createMenuConfig(canvas, dispatch, isSaved, setIsSaved, maxEdgeLength),
		[canvas, dispatch, isSaved, maxEdgeLength],
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
