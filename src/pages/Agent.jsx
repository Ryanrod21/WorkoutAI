import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';

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

      <h2 style={{ color: 'white' }}>AI Suggested Workout Plans</h2>

      {state.plans.map((plan, index) => (
        <div
          key={index}
          onClick={() => handleExpand(index)}
          style={{
            border: '2px solid',
            borderColor:
              pickedIndex === index
                ? '#28a745'
                : expandedIndex === index
                ? 'white'
                : 'white',
            padding: 20,
            marginBottom: 20,
            borderRadius: 8,
            backgroundColor:
              pickedIndex === index
                ? '#e6ffed'
                : expandedIndex === index
                ? '#76bdffff'
                : '#76bdffff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          <h3>Plan {index + 1}</h3>
          <p style={{ color: 'black' }}>
            <strong>Summary:</strong> {plan.plan_summary}
          </p>

          {expandedIndex === index && (
            <div style={{ marginTop: 12 }}>
              <button
                disabled={saving}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePick(index);
                }}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving
                  ? 'Saving...'
                  : pickedIndex === index
                  ? 'Open Workout'
                  : 'I pick this workout'}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
