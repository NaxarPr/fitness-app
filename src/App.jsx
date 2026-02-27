import './App.css';
import { useEffect } from 'react';
import { UserProvider } from './context/UserContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProgramPage from './pages/ProgramPage';

const THEMES = ['dark-blue', 'dark-green'];

function App() {
  useEffect(() => {
    const saved = localStorage.getItem('user-theme');
    if (saved && THEMES.includes(saved)) {
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  return (
    <UserProvider>
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
    </UserProvider>
  );
}

export default App;
