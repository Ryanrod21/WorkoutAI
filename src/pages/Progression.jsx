import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import BackgroundEffect from '../components/UI/BackgroundEffect';
import ProgressBar from '../components/UI/ProgressBar';
import Button from '../components/button';
import EditTableField from '../components/BackendFunction/EditTableField';
import LocalEditTableField from '../components/BackendFunction/LocalEditField';

export default function Progression() {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [q4, setQ4] = useState('');
  const [q5, setQ5] = useState('');
  const [step, setStep] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null); // this will hold user data

  useEffect(() => {
    const fetchUserData = async () => {
      // Get current logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return; // no logged-in user

      // Fetch user's gym row from Supabase
      const { data: userData, error } = await supabase
        .from('gym')
        .select('*')
        .eq('user_id', user.id)
        .order('week', { ascending: false })
        .limit(1)
        .single(); // fetch one row

      if (error) {
        console.error('Error fetching user data:', error.message);
        return;
      }

      setData(userData); // save it in state
    };

    fetchUserData();
  }, []);

  const TOTAL_QUESTIONS = 7; // change to your actual number

  const progressPercent =
    step === 0 ? 0 : Math.round((step / TOTAL_QUESTIONS) * 100);

  const handleSubmitProgress = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('You must be logged in to save your progress.');
      return;
    }

    if (!data || !data.selected_plan) {
      alert('User data not loaded yet. Please wait a moment and try again.');
      return;
    }

    // Convert array or object to a plain dictionary
    const computedDayStatus = Array.isArray(data.day_status)
      ? Object.fromEntries(data.day_status.map((v, i) => [i, v]))
      : typeof data.day_status === 'object'
        ? data.day_status
        : {};

    // 🔹 Wrap previous_plan correctly for backend
    const previousPlanPayload = {
      week: 1, // or use data.selected_plan.week if available
      plans: [data.selected_plan], // wrap in an array
    };

    const payload = {
      type: 'workout_progression', // 👈 THIS is the key
      user_id: user.id,

      previous_plan: previousPlanPayload,

      preference: {
        days: data.days,
        goal: data.goal,
        location: data.location,
        experience: data.experience,
        minutes: data.minutes,
        week: 1,
      },

      difficulty: q1,
      soreness: q2,
      completed: q3,
      progression: q4,
      feedback: q5,
      day_status: computedDayStatus || {},
    };

    console.log('Payload to backend:', payload);
    console.log('previousPlanPayload:', previousPlanPayload);
    console.log('data.selected_plan:', data.selected_plan);

    try {
      const res = await fetch('https://gymai-u2km.onrender.com/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error('Backend error:', result);
        alert('Failed to save progress.');
        return;
      }

      console.log('Backend response:', result); // ✅ See new plans here
      alert('Progress saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    }
  };

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

      {step === 0 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h1>Let's Get Started</h1>
          <p>
            Lets answer some questions to see how you did to see if we need to
            change anything !
          </p>
          <br></br>
          <p>
            If don't want to change anything just hit the skip button and we
            will get your next weeks of workout ready !
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button onClick={() => setStep(step + 1)} label="Get Started" />
            <Button onClick={() => setStep(step + 1)} label="Next" />
            <Button
              onClick={() => {
                setSkipped(true);
                setStep(step + 6);
              }}
              label="Skip"
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h1>How challenging was this weeks workout ?</h1>
          <div className="radio-group">
            {['Too Easy', 'Easy', 'Just Right', 'Hard', 'Too Hard'].map((q) => (
              <label key={q}>
                <input
                  type="radio"
                  value={q}
                  checked={q1 === q}
                  onChange={(e) => setQ1(e.target.value)}
                />
                {q}
              </label>
            ))}
          </div>
          <div>
            <Button onClick={() => setStep(step - 1)} label="Previous" />
            <Button
              onClick={() => setStep(step + 1)}
              label="Next"
              disabled={!q1}
            />
            <Button onClick={() => setStep(step + 1)} label="Skip" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h1>How sore were you getting ? </h1>
          <div className="radio-group">
            {['Not sore', 'Kinda Sore', 'Very Sore'].map((experience) => (
              <label key={experience}>
                <input
                  type="radio"
                  value={experience}
                  checked={q2 === experience}
                  onChange={(e) => setQ2(e.target.value)}
                />
                {experience}
              </label>
            ))}
          </div>
          <div>
            <Button onClick={() => setStep(step - 1)} label="Previous" />
            <Button
              onClick={() => setStep(step + 1)}
              label="Next"
              disabled={!q2}
            />
            <Button onClick={() => setStep(step + 1)} label="Skip" />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h1>Did you complete all schedule workouts this week ? </h1>
          <div className="radio-group">
            {['Yes', 'No', 'Partially'].map((d) => (
              <label key={d}>
                <input
                  type="radio"
                  value={d}
                  checked={q3 === d}
                  onChange={(e) => setQ3(e.target.value)}
                />
                {d}
              </label>
            ))}
          </div>
          <div>
            <Button onClick={() => setStep(step - 1)} label="Previous" />
            <Button
              onClick={() => setStep(step + 1)}
              label="Next"
              disabled={!q3}
            />
            <Button onClick={() => setStep(step + 1)} label="Skip" />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h1>
            Do you feel this week's workouts helped you progress toward your
            goals ?
          </h1>
          <div className="radio-group">
            {['Yes', 'Somewhat', 'No'].map((d) => (
              <label key={d}>
                <input
                  type="radio"
                  value={d}
                  checked={q4 === d}
                  onChange={(e) => setQ4(e.target.value)}
                />
                {d}
              </label>
            ))}
          </div>

          <div>
            <Button onClick={() => setStep(step - 1)} label="Previous" />
            <Button
              onClick={() => setStep(step + 1)}
              label="Next"
              disabled={!q4}
            />
            <Button onClick={() => setStep(step + 1)} label="Skip" />
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h1>Write any comments that you have with this weeks workout ! </h1>

          <input
            type="text"
            placeholder="Example: 'This workout felt too easy', 'I really enjoyed the squats', 'The cardio was tough but manageable'"
            value={q5}
            onChange={(e) => setQ5(e.target.value)}
            className="text-input" // optional styling
          />

          <div>
            <Button onClick={() => setStep(step - 1)} label="Previous" />
            <Button
              onClick={() => setStep(step + 1)}
              label="Next"
              disabled={!q5}
            />
            <Button onClick={() => setStep(step + 1)} label="Skip" />
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="card step-card">
          <ProgressBar progressPercent={progressPercent} show={step > 0} />
          <h2>Confirm Your Selections or Change your selection! </h2>
          <div>
            <EditTableField
              label="Days per Week"
              value={data.days}
              userId={data.user_id}
              column="days"
              onChange={(newValue) =>
                setData((prev) => ({ ...prev, days: newValue }))
              }
            />
            <EditTableField
              label="Goal"
              value={data.goal}
              userId={data.user_id}
              column="goal"
              onChange={(newValue) =>
                setData((prev) => ({ ...prev, goal: newValue }))
              }
            />
            <EditTableField
              label="Experience"
              value={data.experience}
              userId={data.user_id}
              column="experience"
              onChange={(newValue) =>
                setData((prev) => ({ ...prev, experience: newValue }))
              }
            />
            <EditTableField
              label="Minutes per Session"
              value={data.minutes}
              userId={data.user_id}
              column="minutes"
              onChange={(newValue) =>
                setData((prev) => ({ ...prev, minutes: newValue }))
              }
            />
            <EditTableField
              label="Training Location"
              value={data.location}
              userId={data.user_id}
              column="location"
              onChange={(newValue) =>
                setData((prev) => ({ ...prev, location: newValue }))
              }
            />
            <LocalEditTableField
              label="How challenging was this week's workout?"
              value={q1}
              onSave={setQ1}
              options={['Too Easy', 'Easy', 'Just Right', 'Hard', 'Too Hard']}
            />
            <LocalEditTableField
              label="How sore were you getting?"
              value={q2}
              onSave={setQ2}
              options={['Not sore', 'Kinda Sore', 'Very Sore']}
            />

            <LocalEditTableField
              label="Did this week's workouts help your goals?"
              value={q4}
              onSave={setQ4}
              options={['Yes', 'Somewhat', 'No']}
            />

            <LocalEditTableField label="Comments" value={q5} onSave={setQ5} />
          </div>

          <p>
            Everything correct? Click Finish to generate your AI workout and
            save it.
          </p>
          <div>
            <Button
              onClick={() => {
                if (skipped) {
                  setStep(0); // go back to beginning
                  setSkipped(false); // reset skip state
                } else {
                  setStep(step - 1); // normal behavior
                }
              }}
              label="Previous Step"
            />
            <Button
              onClick={handleSubmitProgress}
              label={loading ? 'Saving...' : 'Finish'}
              disabled={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
