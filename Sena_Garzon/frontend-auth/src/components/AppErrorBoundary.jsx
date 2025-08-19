import React from 'react';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Opcional: enviar a un servicio de logs
    // console.error('Render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
          <h1 style={{ color: '#b91c1c', marginBottom: 8 }}>Se produjo un error en la aplicación</h1>
          <p style={{ color: '#374151' }}>Intenta recargar la página. Si el problema persiste, limpia el almacenamiento y vuelve a intentar.</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: 12, color: '#6b7280' }}>
            {String(this.state.error)}
          </details>
          <button
            onClick={() => {
              try { localStorage.clear(); } catch (_) {}
              window.location.reload();
            }}
            style={{
              marginTop: 16,
              background: '#15803d',
              color: 'white',
              border: 0,
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer'
            }}
          >
            Limpiar y recargar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;


