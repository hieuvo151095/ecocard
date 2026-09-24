import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/globals.css';

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Global UI Error Caught:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F5F6', padding: '24px' }}>
          <div style={{ maxWidth: '560px', width: '100%', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #E1E3E6', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px', fontWeight: 'bold' }}>!</div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#232628', marginBottom: '8px' }}>Đã có lỗi xảy ra khi hiển thị giao diện</h2>
            <p style={{ fontSize: '14px', color: '#687582', marginBottom: '20px' }}>{this.state.error?.message || 'Lỗi không xác định.'}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{ padding: '8px 16px', backgroundColor: '#0070CE', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
              >
                Tải lại trang
              </button>
              <button
                onClick={this.handleReset}
                style={{ padding: '8px 16px', backgroundColor: '#FFFFFF', color: '#232628', border: '1px solid #CFD3D8', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
              >
                Xóa cache & Khôi phục
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>
);
