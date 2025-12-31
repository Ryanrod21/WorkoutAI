import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { logoutUser } from './lib/auth';
import Button from './components/button';
import './App.css';

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasWorkout, setHasWorkout] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      // 1️⃣ Get the logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return; // No user, show default UI
      }

      setUser(user);

      // 2️⃣ Check if the user has a saved workout
      const { data: workouts, error } = await supabase
        .from('gym')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching user workouts:', error);
      }

      if (workouts && workouts.length > 0) {
        setHasWorkout(true);
        // 3️⃣ If user has data, redirect to results page with the latest workout
        navigate('/results', { state: workouts[0] });
      }

      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="app-container">
        <p>Loading...</p>
      </div>
    );
  }
  console.log('TEST', user);

  // 4️⃣ Render UI for logged-in user without data
  if (user && !hasWorkout) {
    return (
      <div className="app-container">
        <h1>Hello, {user.user_metadata.full_name}!</h1>
        <p>Ready to start your first AI workout?</p>
        <Button label="Start Workout" onClick={() => navigate('/starting')} />

        <Button label="Log Out" onClick={() => logoutUser} />
      </div>
    );
  }

  // 5️⃣ Default UI for not logged-in users
  return (
    <div className="app-container">
      <h1>Welcome!</h1>
      <div className="section">
        <p>
          This is your AI coach to take you to your next step in your workout.
        </p>
        <p>
          If you are a beginner, intermediate, or advanced, the AI coach will
          help you!
        </p>
        <p>Answer some basic questions to get started.</p>
        <p>
          Save your progress or load your progress by signing in or logging in!
        </p>
        <p>Or you can try for free!</p>
        <p>Are you ready???</p>

        <Button
          className="free"
          onClick={() => navigate('/demo')}
          label={'Try for free'}
        />
      </div>

      <div className="section">
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Button label="Sign Up" onClick={() => navigate('/sign-up')} />
          <Button label="Login" onClick={() => navigate('/login')} />
        </div>
      </div>
    </div>
  );
}
