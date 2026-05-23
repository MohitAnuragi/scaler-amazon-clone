import React from "react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-amazon-gray px-6 text-center">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm text-gray-600">
            Please refresh the page to try again.
          </p>
          <button
            className="mt-4 rounded bg-amazon-yellow px-4 py-2 text-sm font-semibold hover:bg-amazon-yellow-hover"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
