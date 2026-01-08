import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/button';
import './page.css';
import ProgressBar from '../components/UI/ProgressBar';
import BackgroundEffect from '../components/UI/BackgroundEffect';

export default function Questionnaire() {
  const [step, setStep] = useState(0);
  const [goalText, setGoalText] = useState('');
  const [daysText, setDaysText] = useState(null);
  const [trainText, setTrainText] = useState('');
  const [experienceText, setExperienceText] = useState('');
  const [minutesText, setMintuesText] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFinish = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('You must be logged in to save a workout.');
      setLoading(false);
      return;
    }

    const payload = {
      goal: goalText,
      days: daysText,
      train: trainText,
      experience: experienceText,
      minutes: minutesText,
    };
    setLoading(true);

    try {
      // 1️⃣ Send data to AI backend
      const res = await fetch('https://gymai-u2km.onrender.com/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const aiResults = await res.json();

      if (!res.ok) {
        console.error('Backend error:', aiResults);
        alert('Error generating workout');
        setLoading(false);
        return;
      }

      let fullPayload = {
        goal: goalText,
        days: daysText,
        train: trainText,
        minutes: minutesText,
        experience: experienceText,
        plans: aiResults,
      };

      // 2️⃣ Insert 3 plans into Supabase
      const { data, error } = await supabase
        .from('gym')
        .insert([
          {
            goal: goalText,
            days: daysText,
            location: trainText,
            experience: experienceText,
            minutes: minutesText,
            plans: aiResults,
            user_id: user.id,
            selected_plan: null, // not picked yet
          },
        ])
        .select(); // get the inserted row back

      if (error) {
        console.error('Supabase insert failed:', error);
      } else {
        // store the row ID for later updates
        fullPayload.rowId = data[0].id;
      }

      // 3️⃣ Save fullPayload to sessionStorage
      sessionStorage.setItem('workoutData', JSON.stringify(fullPayload));

      // 4️⃣ Navigate to results
      navigate('/results', { state: fullPayload });
    } catch (err) {
      console.error('Fetch/Supabase error:', err);
      alert('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const TOTAL_QUESTIONS = 7; // change to your actual number

  const progressPercent =
    step === 0 ? 0 : Math.round((step / TOTAL_QUESTIONS) * 100);

  return (
    <div className="landing-page">
      <BackgroundEffect />

      {loading && (
        <div className="loading-screen">
          <div className="loader"></div>
          <p className="text">
            Generating your AI workout... this may take a few seconds.
          </p>
        </div>
      )}

      {/* STEP 0 – WELCOME */}
      {step === 0 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h1>Let's Get Started</h1>
          <p>Welcome to your AI Workout Coach experience!</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button onClick={() => setStep(step + 1)} label="Get Started" />
          </div>
        </div>
      )}

      {/* STEP 1 – GOAL SELECTION */}
      {step === 1 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h1>Select your fitness goal</h1>
          <div className="radio-group">
            {[
              'Lose Weight',
              'Build Muscle',
              'Improve Endurance',
              'Genral Fitness',
            ].map((goal) => (
              <label key={goal}>
                <input
                  type="radio"
                  value={goal}
                  checked={goalText === goal}
                  onChange={(e) => setGoalText(e.target.value)}
                />
                {goal}
              </label>
            ))}
          </div>
          <div>
            <Button onClick={() => setStep(step - 1)} label="Previous" />
            <Button onClick={() => setStep(step + 1)} label="Next" />
          </div>
        </div>
      )}

      {/* Setp 2 - Experience */}

      {step === 2 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h1>What is your fitness experience level?</h1>
          <div className="radio-group">
            {[
              'Beginner - New to working out',
              'Intermediate - 1-2 years experience',
              'Advanced - 3+ years experience',
              'Athelete - Professional Level',
            ].map((experience) => (
              <label key={experience}>
                <input
                  type="radio"
                  value={experience}
                  checked={experienceText === experience}
                  onChange={(e) => setExperienceText(e.target.value)}
                />
                {experience}
              </label>
            ))}
          </div>
          <div>
            <Button onClick={() => setStep(step - 1)} label="Previous" />
            <Button onClick={() => setStep(step + 1)} label="Next" />
          </div>
        </div>
      )}

      {/* STEP 3 – DAYS PER WEEK */}
      {step === 3 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h1>How many days do you want to train?</h1>
          <div className="radio-group">
            {[3, 4, 5, 6].map((d) => (
              <label key={d}>
                <input
                  type="radio"
                  value={d}
                  checked={daysText === d}
                  onChange={(e) => setDaysText(Number(e.target.value))}
                />
                {d} days per week
              </label>
            ))}
          </div>
          <div>
            <Button onClick={() => setStep(step - 1)} label="Previous" />
            <Button onClick={() => setStep(step + 1)} label="Next" />
          </div>
        </div>
      )}

      {/* STEP 4 – Minutes */}
      {step === 4 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h1>How many minutes do you want to train?</h1>
          <div className="radio-group">
            {[30, 45, 60, 90].map((d) => (
              <label key={d}>
                <input
                  type="radio"
                  value={d}
                  checked={minutesText === d}
                  onChange={(e) => setMintuesText(Number(e.target.value))}
                />
                {d === 90 ? '90+ minutes' : `${d} minutes`}
              </label>
            ))}
          </div>

          <div>
            <Button onClick={() => setStep(step - 1)} label="Previous" />
            <Button onClick={() => setStep(step + 1)} label="Next" />
          </div>
        </div>
      )}

      {/* STEP 5 – TRAINING LOCATION */}
      {step === 5 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h1>Where are you training?</h1>
          <div className="radio-group">
            {[
              'Gym with equipment',
              'Home with minimal equipment',
              'Outdoor activities',
              'Mixed / Flexible',
            ].map((loc) => (
              <label key={loc}>
                <input
                  type="radio"
                  value={loc}
                  checked={trainText === loc}
                  onChange={(e) => setTrainText(e.target.value)}
                />
                {loc}
              </label>
            ))}
          </div>
          <div>
            <Button onClick={() => setStep(step - 1)} label="Previous" />
            <Button onClick={() => setStep(step + 1)} label="Next" />
          </div>
        </div>
      )}

      {/* STEP 6 – CONFIRMATION */}
      {step === 6 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h2>Confirm Your Selections</h2>
          <p>
            <strong>Goal:</strong> {goalText}
          </p>
          <p>
            <strong>Experience:</strong> {experienceText}
          </p>
          <p>
            <strong>Days per week:</strong> {daysText}
          </p>
          <p>
            <strong>Minutes per Session:</strong> {minutesText}
          </p>
          <p>
            <strong>Training location:</strong> {trainText}
          </p>
          <p>
            Everything correct? Click Finish to generate your AI workout and
            save it.
          </p>
          <div>
            <Button onClick={() => setStep(step - 1)} label="Previous Step" />
            <Button
              onClick={handleFinish}
              label={loading ? 'Saving...' : 'Finish'}
              disabled={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
