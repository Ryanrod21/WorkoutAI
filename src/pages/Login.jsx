'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../lib/auth';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);

      const { data: workout, error } = await supabase
        .from('gym')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }) // latest first
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (workout) {
        sessionStorage.setItem('workoutData', JSON.stringify(workout));

        navigate('/results', { state: workout });
      } else {
        navigate('/landing');
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleForgotPassword = () => {
    navigate('/email-reset-password');
};


  return (
    <form onSubmit={handleLogin} className="form-section">
      <h2 className="login-title">Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="login-input"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="login-input"
      />

      <button type="submit" className="login-button">
        Login
      </button>

      <button
        type="button"
        onClick={handleForgotPassword}
        className="forgot-password-button"
      >
        Forgot Password
      </button>

      {message && <p className="login-message">{message}</p>}
    </form>
  );
}
