import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import TradeChartPage from './pages/TradeChartPage';
import TradeManagePage from './pages/TradeManagePage';
import Home from './pages/Home';
import LobbyPage from './components/LobbyPage';
import RoomPage from './components/RoomPage';
import UnifiedMeetingPage from './pages/UnifiedMeetingPage';

import './index.css';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const username = token ? getUsernameFromToken(token) : '';

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <div className="min-h-screen text-white bg-black">
        {/* ✅ Enhanced Navbar with Branding, Links, Credit */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-6 border-b shadow-md bg-teal-700/70 backdrop-blur-md border-teal-300/20">
          {/* Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-semibold text-white transition hover:text-cyan-200">
              TradeBridge
            </Link>
            {token && (
              <div className="flex gap-4 font-medium text-white">
                <Link to="/meeting" className="transition hover:text-cyan-200">Meetings</Link>
                <Link to="/manage" className="transition hover:text-cyan-200">Analyse Trades</Link>
                <Link to="/chart" className="transition hover:text-cyan-200">Market Tracker</Link>
              </div>
            )}
          </div>

          {/* Credit + Auth Buttons */}
          <div className="flex items-center gap-4 text-sm text-white">
            <span className="hidden text-xs sm:inline text-white/70">Made by Aviral Srivastava</span>
            <a
              href="https://github.com/meaviral17"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-cyan-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.6-4-1.6-.6-1.5-1.4-2-1.4-2-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6a4.7 4.7 0 011.3-3.3 4.4 4.4 0 01.1-3.3s1-.3 3.4 1.2a11.7 11.7 0 016.2 0c2.4-1.5 3.4-1.2 3.4-1.2.3 1 .3 2.3.1 3.3A4.7 4.7 0 0120 13c0 4.8-2.8 5.7-5.5 6 .4.3.8.9.8 1.8v2.7c0 .3.2.6.8.5A12 12 0 0012 .5z" />
              </svg>
            </a>

            {token ? (
              <button onClick={handleLogout} className="transition hover:text-red-400">
                Logout
              </button>
            ) : (
              <Link to="/login" className="transition hover:text-cyan-300">
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* Offset for Fixed Navbar */}
        <div className="pt-16">
          <Routes>
            <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
            <Route
              path="/login"
              element={
                <Login
                  setToken={setToken}
                  goToRegister={() => (window.location.href = '/register')}
                />
              }
            />
            <Route
              path="/register"
              element={
                <Register
                  goToLogin={() => (window.location.href = '/login')}
                />
              }
            />
            <Route
              path="/lobby"
              element={
                token ? (
                  <LobbyPage token={token} username={username} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/room/:roomId"
              element={
                token ? (
                  <RoomPageWrapper token={token} username={username} />
                ) : (
                  <Navigate to="/lobby" />
                )
              }
            />
            <Route
              path="/manage"
              element={
                token ? (
                  <TradeManagePage token={token} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/chart"
              element={
                token ? (
                  <TradeChartPage token={token} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/meeting"
              element={
                token ? (
                  <UnifiedMeetingPage />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="*" element={<h2 className="p-6">404 - Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function getUsernameFromToken(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded.sub || decoded.username || 'user';
  } catch {
    return 'user';
  }
}

function RoomPageWrapper({ token, username }) {
  const location = useLocation();
  const { videoClient, chatClient } = location.state || {};
  if (!videoClient || !chatClient) return <Navigate to="/lobby" />;
  return (
    <RoomPage
      videoClient={videoClient}
      chatClient={chatClient}
      token={token}
      username={username}
    />
  );
}

export default App;
