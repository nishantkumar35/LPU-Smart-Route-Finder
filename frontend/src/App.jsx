import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import WorkspacePage from './pages/WorkspacePage';
import AuthPage from './pages/AuthPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d111c',
              border: '1px solid #1e293b',
              color: '#e2e8f0',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              borderRadius: '8px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#062d1b' },
              duration: 3000,
            },
            error: {
              iconTheme: { primary: '#f43f5e', secondary: '#330811' },
              duration: 4000,
            },
          }}
        />

        <Routes>
          {/* Public Auth Route */}
          <Route path="/login" element={<AuthPage />} />

          {/* Unified Application Workspace */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <WorkspacePage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
