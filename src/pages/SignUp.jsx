import { useState } from 'react';
import { signUpUser } from '../lib/auth';
import Button from '../components/button';

export default function SignUp() {
  const [name, setName] = useState(''); // NEW: name state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    try {
      // Pass the name along with email and password
      const { data, error } = await signUpUser({ email, password, name });
      if (error) throw error;
      setMessage('Sign up successful! Check your email.');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="form-section">
      <h2>Sign Up</h2>

      {/* Name Input */}
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button label="Sign Up" onClick={handleSignUp} />

      {message && <p>{message}</p>}
    </div>
  );
}
