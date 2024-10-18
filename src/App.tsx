import SvgCanvas from "./components/SvgCanvas/SvgCanvas";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import css from "./App.module.css";
import Menu from "./components/Menu/Menu";
import { useView } from "./hooks/useView";

const ERROR_FALLBACK_COMPONENT = <div>Something went wrong</div>;

const App = () => {
	const view = useView();

	return (
		<div className={css.root}>
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
