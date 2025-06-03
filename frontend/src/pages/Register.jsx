import { useState } from 'react';
import axios from 'axios';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

function Register({ goToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const register = async () => {
    try {
      await axios.post('https://tradebridge.onrender.com/api/auth/register', { username, password });
      setMessage('✅ User registered. You can now log in.');
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Registration failed'));
    }
  };

  const particlesInit = async (main) => await loadFull(main);

  return (
    <div className="relative min-h-screen overflow-hidden text-white bg-gradient-to-br from-black via-gray-900 to-gray-800">
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
              animation: { enable: true, speed: 1, minimumValue: 0.1 },
            },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: "grab" } },
            modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } } },
          },
        }}
        className="absolute inset-0 z-0"
      />

      <div className="absolute z-0 bg-yellow-400 rounded-full w-96 h-96 opacity-20 blur-3xl top-16 -left-24 animate-pulse"></div>
      <div className="absolute z-0 rounded-full w-72 h-72 bg-violet-500 opacity-20 blur-3xl bottom-10 right-10 animate-ping"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <Tilt glareEnable={true} glareMaxOpacity={0.2} glareColor="#ffffff" className="rounded-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="p-8 border border-gray-600 shadow-2xl backdrop-blur-lg bg-white/10 rounded-xl w-80"
          >
            <h2 className="mb-6 text-2xl font-bold text-center">🆕 Register</h2>

            <input
              className="w-full p-2 mb-4 text-white placeholder-gray-400 bg-transparent border border-gray-400 rounded"
              placeholder="Username"
              onChange={e => setUsername(e.target.value)}
            />
            <input
              className="w-full p-2 mb-4 text-white placeholder-gray-400 bg-transparent border border-gray-400 rounded"
              type="password"
              placeholder="Password"
              onChange={e => setPassword(e.target.value)}
            />
            <button
              onClick={register}
              className="w-full py-2 mt-2 font-semibold text-white transition bg-green-500 rounded hover:bg-green-600"
            >
              Create Account
            </button>
            <p
              className="mt-3 text-sm text-center text-teal-300 underline cursor-pointer"
              onClick={goToLogin}
            >
              🔁 Back to Login
            </p>
            {message && <p className="mt-4 text-sm text-center text-gray-300">{message}</p>}
          </motion.div>
        </Tilt>
      </div>
    </div>
  );
}

export default Register;
