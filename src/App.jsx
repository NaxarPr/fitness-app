import './App.css';
import { UserProvider } from './context/UserContext';
import AppContent from './components/AppContent';

function App() {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
        <AppContent />
      </div>
    </UserProvider>
  );
}

export default App;
