import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Button from "../components/button";

export default function PasswordReset() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setError("Invalid or expired password reset link.");
      }
      setLoading(false);
    });
  }, []);

  const handleResetPassword = async () => {
    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated successfully ✅");

      // Optional but recommended
      setTimeout(async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
      }, 1500);
    }
  };

  if (loading) {
    return <p>Verifying reset link...</p>;
  }

  return (
    <form className="form-section" onSubmit={(e) => e.preventDefault()}>
      <h2 className="login-title">Set New Password</h2>

      <input
        type="password"
        placeholder="New password"
        className="login-input"
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm password"
        className="login-input"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button
        type="button"
        onClick={handleResetPassword}
        className="login-button"
        label="Update Password"
      />

      {error && <p className="login-error">{error}</p>}
      {message && <p className="login-message">{message}</p>}
    </form>
  );
}
