import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import VideoCallPage from './pages/VideoCallPage';
import TradeUploadPage from './pages/TradeUploadPage';
import TradeChartPage from './pages/TradeChartPage';
import TradeExportPage from './pages/TradeExportPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <nav className="flex justify-between p-4 text-white bg-gray-800">
        <div className="flex gap-4">
          <Link to="/" className="hover:underline">Home</Link>
          {token && (
            <>
              <Link to="/video" className="hover:underline">Video Call</Link>
              <Link to="/upload" className="hover:underline">Upload</Link>
              <Link to="/chart" className="hover:underline">Chart</Link>
              <Link to="/export" className="hover:underline">Export</Link>
            </>
          )}
        </div>
        {token ? (
          <button onClick={handleLogout} className="hover:underline">Logout</button>
        ) : (
          <Link to="/login" className="hover:underline">Login</Link>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<h2 className="p-6 text-lg">📈 Welcome to TradeBridge</h2>} />
        <Route path="/login" element={<Login setToken={setToken} goToRegister={() => window.location.href = '/register'} />} />
        <Route path="/register" element={<Register goToLogin={() => window.location.href = '/login'} />} />
        <Route path="/video" element={token ? <VideoCallPage token={token} /> : <Navigate to="/login" />} />
        <Route path="/upload" element={token ? <TradeUploadPage token={token} /> : <Navigate to="/login" />} />
        <Route path="/chart" element={token ? <TradeChartPage token={token} /> : <Navigate to="/login" />} />
        <Route path="/export" element={token ? <TradeExportPage token={token} /> : <Navigate to="/login" />} />
        <Route path="*" element={<h2 className="p-6">404 - Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
