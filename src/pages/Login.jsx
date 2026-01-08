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
      // 1️⃣ Log in
      const user = await loginUser(email, password);

      // 2️⃣ Fetch user's latest workout
      const { data: workout, error } = await supabase
        .from('gym')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }) // latest first
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows found, ignore this
        throw error;
      }

      if (workout) {
        // 3️⃣ Save workout data to sessionStorage
        sessionStorage.setItem('workoutData', JSON.stringify(workout));

        // 4️⃣ Go straight to results page
        navigate('/results', { state: workout });
      } else {
        // No workout found → go to landing page to create one
        navigate('/landing');
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
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

      {message && <p className="login-message">{message}</p>}
    </form>
  );
}
