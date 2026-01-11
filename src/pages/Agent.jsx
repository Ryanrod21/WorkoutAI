import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { Dumbbell, Zap, Trophy } from 'lucide-react';

export default function Agent() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState(null); // holds the gym row
  const [userName, setUserName] = useState('');

  const navigate = useNavigate();

  // 🔹 Fetch logged-in user + latest workout row
  useEffect(() => {
    const fetchUserAndWorkout = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      if (user.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name);
      }

      const { data, error } = await supabase
        .from('gym')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Failed to fetch workout:', error);
        return;
      }

      if (data && data.length > 0) {
        setState(data[0]);
      }
    };

    fetchUserAndWorkout();
  }, []);

  // 🔹 Guard
  if (!state || !state.plans) {
    return (
      <div style={{ padding: 40 }}>
        <h2>No workout found</h2>
        <p>Please generate a workout first.</p>
      </div>
    );
  }

  // 🔑 Derived from DB (persistent)
  const pickedIndex = state.selected_plan_index;

  const handleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handlePick = async (index) => {
    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert('You must be logged in.');
        return;
      }

      // 🔹 Update selected plan
      const { error } = await supabase
        .from('gym')
        .update({
          selected_plan_index: index,
          selected_plan: state.plans[index],
        })
        .eq('id', state.id)
        .eq('user_id', user.id); // 🔑 required for RLS

      if (error) throw error;

      // 🔹 Update local state for instant UI feedback
      setState((prev) => ({
        ...prev,
        selected_plan_index: index,
        selected_plan: prev.plans[index],
      }));

      // 🔹 Navigate
      navigate('/selected-workout', {
        state: {
          goal: state.goal,
          days: state.days,
          train: state.location,
          pickedPlan: state.plans[index],
        },
      });
    } catch (err) {
      console.error('Failed to save selected plan:', err);
      alert('Failed to save workout selection.');
    } finally {
      setSaving(false);
    }
  };

  const categoryIcons = {
    'Strength Builder': Dumbbell,
    'Endurance Elite': Zap,
    'Athletic Performance': Trophy,
  };

  console.log(state);
  console.log(state.plans[0].plans);

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ color: 'white' }}>Your Workout Summary</h1>
      {userName && <h2 style={{ color: 'white' }}>Welcome, {userName}</h2>}

      <section className="section-results" style={{ marginBottom: 20 }}>
        <p>
          <strong>Goal:</strong> {state.goal}
        </p>
        <p>
          <strong>Training Days:</strong> {state.days} days per week
        </p>
        <p>
          <strong>Training Location:</strong> {state.location}
        </p>
      </section>

      <hr />

      {state.plans[0].plans.map((plan, index) => {
        const CategoryIcon = categoryIcons[plan.category]; // just use it here

        return (
          <div
            key={index}
            className={`plan-card 
            ${pickedIndex === index ? 'picked' : ''} 
            ${expandedIndex === index ? 'expanded' : ''}`}
            onClick={() => {
              handleExpand(index);
            }}
          >
            <div className="plan-header">
              <div
                className={`icon-small-div ${
                  pickedIndex === index ? 'picked' : ''
                }`}
              >
                <CategoryIcon
                  className={`icon-small ${
                    pickedIndex === index ? 'picked' : ''
                  }`}
                />
              </div>

              <div className="plan-title">
                <h3>Plan {index + 1}</h3>
                <p>
                  <strong>Summary:</strong> {plan.plan_summary}
                </p>

                {expandedIndex === index && Array.isArray(plan.expect) && (
                  <div className="plan-expanded">
                    <ul className="custom-list">
                      {plan.expect.map((ex, i) => (
                        <li key={i}>
                          <CategoryIcon className="icon-bullet" />
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div className="plan-action">
        <button
          className="pick-button"
          disabled={pickedIndex === null || saving}
          onClick={() => handlePick(pickedIndex)}
        >
          {pickedIndex === null ? 'Select a workout' : 'Confirm workout'}
        </button>
      </div>
    </div>
  );
}
