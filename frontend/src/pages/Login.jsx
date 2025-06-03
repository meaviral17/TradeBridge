import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

function Login({ setToken, goToRegister }) {
  const [username, setUsername] = useState('testuser1');
  const [password, setPassword] = useState('test1234');
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post('https://tradebridge.onrender.com/api/auth/login', {
        username,
        password
      });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      navigate('/');
    } catch (err) {
      alert('❌ Invalid credentials');
    }
  };

  const particlesInit = async (main) => await loadFull(main);

  return (
    <div className="relative min-h-screen overflow-hidden text-white bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Animated galaxy particles */}
      <Particles
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: "#000" },
          particles: {
            number: { value: 100 },
            color: { value: ["#00ffff", "#ff00ff", "#ffffff"] },
            size: { value: { min: 1, max: 3 } },
            move: { speed: 0.6 },
            opacity: {
              value: 0.4,
              animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false },
            },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: "grab" } },
            modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } } },
          },
        }}
        className="absolute inset-0 z-0"
      />

      {/* Floating blurred aesthetic blobs */}
      <div className="absolute z-0 bg-pink-500 rounded-full w-96 h-96 opacity-20 blur-3xl top-10 -left-20 animate-pulse"></div>
      <div className="absolute z-0 rounded-full w-80 h-80 bg-cyan-400 opacity-20 blur-3xl bottom-20 right-10 animate-ping"></div>

      {/* Login card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <Tilt glareEnable={true} glareMaxOpacity={0.2} glareColor="#ffffff" className="rounded-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="p-8 border border-gray-600 shadow-2xl backdrop-blur-lg bg-white/10 rounded-xl w-80"
          >
            <h2 className="mb-4 text-2xl font-bold text-center">🔐 Login to TradeBridge</h2>

            <input
              className="w-full p-2 mb-3 text-white placeholder-gray-400 bg-transparent border border-gray-400 rounded"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              className="w-full p-2 mb-4 text-white placeholder-gray-400 bg-transparent border border-gray-400 rounded"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              onClick={login}
              className="w-full py-2 font-semibold text-white transition bg-teal-500 rounded hover:bg-teal-600"
            >
              Login
            </button>

            <p
              className="mt-4 text-sm text-center text-teal-300 underline cursor-pointer"
              onClick={goToRegister}
            >
              🆕 Create a new account
            </p>
          </motion.div>
        </Tilt>
      </div>
    </div>
  );
}

export default Login;
