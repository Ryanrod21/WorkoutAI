'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { logoutUser } from '../lib/auth';

function Navigation() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <div className="nav-container">
      <h1>Workout AI Coach</h1>

      <div className="nav-links">
        <h3>
          <a href="/">Home</a>
        </h3>

        {session && (
          <h3>
            <button onClick={handleLogout}>Sign Out</button>
          </h3>
        )}
      </div>
    </div>
  );
}

export default Navigation;
