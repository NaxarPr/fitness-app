import './App.css';
import { UserProvider } from './context/UserContext';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProgramPage from './pages/ProgramPage';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
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
