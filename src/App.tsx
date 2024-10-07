import SvgCanvas from "./components/SvgCanvas/SvgCanvas";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

import Menu from "./components/Menu/Menu";
import { useSelector } from "react-redux";
import type { RootState } from "./store";

// TODO: image trace view

const ERROR_FALLBACK_COMPONENT = <div>Something went wrong</div>;

const App = () => {
	const view = useSelector<RootState, RootState["canvas"]["view"]>(
		(state) => state.canvas.view,
	);

	return (
		<div className='App'>
			<ErrorBoundary
				// Force re-render of canvas when key changes. This won't clear the canvas.
				key={view}
				fallback={ERROR_FALLBACK_COMPONENT}
			>
				<SvgCanvas />
			</ErrorBoundary>
			<Menu />
		</div>
	);
};

export default App;
