import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import VideoCallPage from './pages/VideoCallPage';
import TradeChartPage from './pages/TradeChartPage';
import TradeManagePage from './pages/TradeManagePage';
import ChatPage from './pages/ChatPage';
import LobbyPage from './components/LobbyPage';
import RoomPage from './components/RoomPage';

import './index.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [darkMode, setDarkMode] = useState(false);
  const username = 'alice'; // Replace with actual user logic

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <div className="min-h-screen text-black transition-colors duration-200 bg-white dark:bg-gray-900 dark:text-white">
        <nav className="flex justify-between p-4 text-white bg-gray-800 dark:bg-gray-950">
          <div className="flex gap-4">
            <Link to="/" className="hover:underline">Home</Link>
            {token && (
              <>
                <Link to="/chat" className="hover:underline">Chat</Link>
                <Link to="/video" className="hover:underline">Video Call</Link>
                <Link to="/lobby" className="hover:underline">Rooms</Link>
                <Link to="/manage" className="hover:underline">Manage Trades</Link>
                <Link to="/chart" className="hover:underline">Chart</Link>
                
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="text-sm hover:underline">
              {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
            </button>
            {token ? (
              <button onClick={handleLogout} className="text-sm hover:underline">Logout</button>
            ) : (
              <Link to="/login" className="text-sm hover:underline">Login</Link>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<h2 className="p-6 text-lg">📈 Welcome to TradeBridge</h2>} />
          <Route path="/login" element={<Login setToken={setToken} goToRegister={() => window.location.href = '/register'} />} />
          <Route path="/register" element={<Register goToLogin={() => window.location.href = '/login'} />} />
          <Route path="/chat" element={token ? <ChatPage /> : <Navigate to="/login" />} />
          <Route path="/video" element={token ? <VideoCallPage token={token} /> : <Navigate to="/login" />} />
          <Route path="/lobby" element={token ? <LobbyPage token={token} username={username} /> : <Navigate to="/login" />} />
          <Route path="/room/:roomId" element={token ? <RoomPageWrapper token={token} username={username} /> : <Navigate to="/login" />} />
          <Route path="/manage" element={token ? <TradeManagePage token={token} /> : <Navigate to="/login" />} />
          <Route path="/chart" element={token ? <TradeChartPage token={token} /> : <Navigate to="/login" />} />
          <Route path="*" element={<h2 className="p-6">404 - Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

// Wrapper for dynamic Room state
function RoomPageWrapper({ token, username }) {
  const location = useLocation();
  const { videoClient, chatClient } = location.state || {};
  if (!videoClient || !chatClient) return <Navigate to="/lobby" />;
  return <RoomPage videoClient={videoClient} chatClient={chatClient} token={token} username={username} />;
}

export default App;