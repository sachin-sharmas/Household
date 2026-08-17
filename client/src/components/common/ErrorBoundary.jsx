import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-screen place-items-center px-4 text-center">
          <div className="grid gap-2">
            <h1 className="text-2xl font-extrabold">Something went wrong</h1>
            <p className="text-gray-500">Please refresh the page. If the problem continues, contact support.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
