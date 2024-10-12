import React, { type ErrorInfo, type ReactNode } from "react";

interface Props {
	children?: ReactNode;
	fallback: ReactNode;
}

interface State {
	hasError: boolean;
	fallback: ReactNode;
}

class ErrorBoundary extends React.Component<Props, State> {
	public state: State = {
		hasError: false,
		fallback: null,
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			hasError: false,
			fallback: props.fallback,
		};
	}

	public static getDerivedStateFromError(_: Error): Partial<State> {
		return { hasError: true };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
	}

	public render() {
		if (this.state.hasError) {
			return this.props.fallback ?? <p>Sorry an error occurred.</p>;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
