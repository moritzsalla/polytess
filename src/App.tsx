import "./App.css";
import DelaunayTriangulation from "./DelaunayTriangulation";

function App() {
	return (
		<div className='App'>
			<DelaunayTriangulation
				points={[
					[50, 50],
					[150, 50],
					[100, 150],
					[200, 200],
					[300, 100],
					[350, 200],
					[250, 250],
					[200, 350],
					[100, 300],
					[50, 350],
					[50, 250],
					[150, 200],
				]}
				width={400}
				height={400}
			/>
		</div>
	);
}

export default App;
