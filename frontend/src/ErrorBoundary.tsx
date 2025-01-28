import React, { ErrorInfo } from "react";
import { Childrenable } from "./domains/global/types/Components";

interface GlobalErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends React.Component<
  Childrenable,
  GlobalErrorBoundaryState
> {
  constructor(props: Childrenable) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): GlobalErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught in global boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        // TODO: customizar mensagem de erro
        <div>
          <h1>Something went wrong.</h1>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default GlobalErrorBoundary;
