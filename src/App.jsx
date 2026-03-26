import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProgramPage from './pages/ProgramPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedLayout from './layouts/ProtectedLayout';
import { useAuthStore } from './store/authStore';

const THEMES = ['dark-blue', 'dark-green'];

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    const saved = localStorage.getItem('user-theme');
    if (saved && THEMES.includes(saved)) {
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-main text-white">
        <div className="container mx-auto">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/exercises" element={<ProgramPage />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
