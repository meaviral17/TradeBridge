import { useState } from 'react';
import axios from 'axios';

function Register({ goToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const register = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/register', {
        username,
        password
      });
      setMessage('✅ User registered. You can now log in.');
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Registration failed'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow w-80">
        <h2 className="mb-4 text-xl font-bold text-center">🆕 Register</h2>
        <input className="w-full p-2 mb-3 border rounded" placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <input className="w-full p-2 mb-3 border rounded" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={register} className="w-full p-2 text-white bg-green-600 rounded hover:bg-green-700">Create Account</button>
        <p className="mt-2 text-sm text-center text-gray-600 underline cursor-pointer" onClick={goToLogin}>
          🔁 Back to Login
        </p>
        {message && <p className="mt-3 text-sm text-center">{message}</p>}
      </div>
    </div>
  );
}

export default Register;
