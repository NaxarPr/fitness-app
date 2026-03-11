import './App.css';
import { useEffect } from 'react';
import { useAppStore } from './store/appStore';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProgramPage from './pages/ProgramPage';
import { useShallow } from 'zustand/shallow';

const THEMES = ['dark-blue', 'dark-green'];

function App() {
  const fetchUsers = useAppStore(useShallow((state) => state.fetchUsers));

  useEffect(() => {
    const saved = localStorage.getItem('user-theme');
    if (saved && THEMES.includes(saved)) {
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Router>
      <div className="min-h-screen bg-main text-white">
        <div className="container mx-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/exercises" element={<ProgramPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
