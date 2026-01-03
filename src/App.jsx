import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { logoutUser } from './lib/auth';
import Card from './components/UI/Card';
import { Dumbbell, Zap, Target } from 'lucide-react';
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
      <div class="bg-wrapper">
        <div class="glow glow-1"></div>
        <div class="glow glow-2"></div>
      </div>

      <div className="dumbbell-div">
        <Dumbbell className="dumbbell icon-primary" />
      </div>

      <h1>Transform Your Fitness Journey</h1>
      <h2>
        Get a personalized workout plan designed specifically for your goals,
        <br></br>
        experience level, and lifestyle. Start your transformation today.
      </h2>

      <div className="card-container">
        <Card
          label={'Tailored plans for your specific fitness objectives'}
          title={'Goal-Driven'}
          icon={Target}
        />
        <Card
          label={'Plans that evolve with your progess'}
          title={'Adaptive Training'}
          icon={Zap}
        />
        <Card
          label={'Professional coaching at your finger tips'}
          title={'Expert Guidance'}
          icon={Dumbbell}
        />
      </div>

      <div style={{ marginTop: '30px' }}>
        <Button
          className="free-btn"
          onClick={() => navigate('/demo')}
          label={'Watch the Demo to see how everything works !'}
        />
      </div>

      <div className="section">
        <h2>Create an Account or Sign in ! </h2>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
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
      <div style={{ marginTop: '30px', color: 'white' }}>
        <p>Get your workout plans in minutes !</p>
      </div>
    </div>
  );
}
