import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setToken, goToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password
      });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      navigate('/chart'); // ✅ Redirect to default protected page
    } catch (err) {
      console.error('Login error:', err);
      alert('❌ Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow w-80">
        <h2 className="mb-4 text-xl font-bold text-center">🔐 Login to TradeBridge</h2>
        <input className="w-full p-2 mb-3 border rounded" placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <input className="w-full p-2 mb-3 border rounded" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={login} className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700">Login</button>
        <p className="mt-2 text-sm text-center text-gray-600 underline cursor-pointer" onClick={goToRegister}>
          🆕 Create a new account
        </p>
      </div>
    </div>
  );
}

export default Login;
