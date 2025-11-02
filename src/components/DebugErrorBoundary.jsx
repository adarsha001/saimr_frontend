// components/DebugErrorBoundary.jsx
import { Component } from 'react';

class DebugErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null };
  
  componentDidCatch(error, errorInfo) {
    console.error('❌ Component Error:', error);
    console.error('📋 Component Stack:', errorInfo.componentStack);
    this.setState({ hasError: true, error, errorInfo });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded">
          <h3 className="text-red-800 font-bold">Component Error</h3>
          <p className="text-red-600">{this.state.error?.message}</p>
          <details className="mt-2 text-sm">
            <summary>Component Stack</summary>
            <pre className="whitespace-pre-wrap">
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default DebugErrorBoundary;