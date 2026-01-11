import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { logoutUser } from './lib/auth';
import { Dumbbell, Zap, Target } from 'lucide-react';
import Button from './components/button';
import './App.css';
import HomeCard from './components/UI/Card';
import BackgroundEffect from './components/UI/BackgroundEffect';

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
        // navigate('/results', { state: workouts[0] });
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

  return (
    <div className="app-container">
      <BackgroundEffect />

      {/* 🔥 Main Homepage Content (everyone sees this) */}
      <div className="dumbbell-div">
        <Dumbbell className="dumbbell icon-primary" />
      </div>

      <h1>Transform Your Fitness Journey</h1>
      <h2>
        Get a personalized workout plan designed specifically for your goals,
        <br />
        experience level, and lifestyle. Start your transformation today.
      </h2>

      <div className="homecard-container">
        <HomeCard
          label="Tailored plans for your specific fitness objectives"
          title="Goal-Driven"
          icon={Target}
        />
        <HomeCard
          label="Plans that evolve with your progress"
          title="Adaptive Training"
          icon={Zap}
        />
        <HomeCard
          label="Professional coaching at your fingertips"
          title="Expert Guidance"
          icon={Dumbbell}
        />
      </div>

      <div style={{ marginTop: '30px' }}>
        <Button
          className="free-btn"
          onClick={() => navigate('/demo')}
          label="Watch the Demo to see how everything works!"
        />
      </div>

      {!user && (
        <div className="section">
          <h2>Create an Account or Sign in!</h2>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
            }}
          >
            <Button
              className="log-in-sign-up-btn"
              label="Sign Up"
              onClick={() => navigate('/sign-up')}
            />
            <Button
              className="log-in-sign-up-btn"
              label="Login"
              onClick={() => navigate('/login')}
            />
          </div>
        </div>
      )}

      {user && (
        <div className="welcome-section">
          <h1>Hello, {user.user_metadata?.full_name}!</h1>
          <p>Ready to start your AI workout?</p>

          <div className="welcome-actions">
            {!hasWorkout && (
              <Button
                className="log-in-sign-up-btn"
                label="Start Workout"
                onClick={() => navigate('/questionnaire')}
              />
            )}

            {/* You can also show other buttons here if needed */}
          </div>
          {hasWorkout && (
            <div className="welcome-actions">
              <p>You already have a workout plan!</p>
              <Button
                className="log-in-sign-up-btn"
                label="Your Workout"
                onClick={() => navigate('/results')}
              />
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '30px', color: 'white' }}>
        <p>Get your workout plans in minutes!</p>
      </div>
    </div>
  );
}
