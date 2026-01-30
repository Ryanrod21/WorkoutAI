import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/button';

export default function EmailPasswordRest() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdatePassword = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      {redirectTo: "http://localhost:5173/password-reset", }
    );

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Email sent to update password !');
    }
  };

  return (
    <form className='form-section' onSubmit={(e) => e.preventDefault()}>
      <h2 className='login-title'>Password Reset</h2>
      <input
        type='email'
        placeholder='Email'
        onChange={(e) => setEmail(e.target.value)}
        className='login-input'
        />

      <Button type='button' onClick={handleUpdatePassword} className='login-button' label={"Update Password"} />
            {message && <p className="login-message">{message}</p>}
            {error && <p className="login-message">{error}</p>}

    </form>
  );
}