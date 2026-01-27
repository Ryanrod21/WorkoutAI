import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { Dumbbell, Zap, Trophy } from 'lucide-react';

export default function Agent() {
  const navigate = useNavigate();

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [tempPickedIndex, setTempPickedIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [gymRow, setGymRow] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  const plansRef = useRef(null);

  // 🔹 Fetch user + workout
  useEffect(() => {
    const fetchUserAndWorkout = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

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
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setLoading(false);
        return;
      }

      const row = data[0];
      setGymRow(row);

      if (row?.selected_plan) {
        navigate('/selected-workout');
        return;
      }

      const extractedWorkouts = row.plans?.[0]?.plans ?? [];
      setWorkouts(extractedWorkouts);

      setLoading(false);
    };

    fetchUserAndWorkout();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (plansRef.current && !plansRef.current.contains(e.target)) {
        setExpandedIndex(null);
        setTempPickedIndex(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // 🔹 1. Loading screen
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading your workout...</p>
      </div>
    );
  }

  // 🔹 2. No workout exists
  if (!gymRow || workouts.length === 0) {
    return (
      <div style={{ padding: 40 }}>
        <h2>No workout found</h2>
        <p>Please generate a workout first.</p>
      </div>
    );
  }

  const handleExpandAndPick = (index) => {
    setExpandedIndex(index); // expands clicked card
    setTempPickedIndex(index); // temporary selection
  };

  const handleConfirmPick = async () => {
    if (tempPickedIndex === null) return;

    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert('You must be logged in.');
        return;
      }

      const pickedWorkout = workouts[tempPickedIndex];

      const { error } = await supabase
        .from('gym')
        .update({
          selected_plan: pickedWorkout, // save the plan directly
        })
        .eq('id', gymRow.id)
        .eq('user_id', user.id);

      if (error) throw error;

      // update UI instantly
      setGymRow((prev) => ({
        ...prev,
        selected_plan: pickedWorkout,
      }));

      navigate('/selected-workout', {
        state: {
          goal: gymRow.goal,
          days: gymRow.days,
          location: gymRow.location,
          pickedPlan: pickedWorkout,
        },
      });
    } catch (err) {
      console.error(err);
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

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ color: 'white' }}>Your Workout Summary</h1>
      {userName && <h2 style={{ color: 'white' }}>Welcome, {userName}</h2>}

      <section className="section-results">
        <p>
          <strong>Goal:</strong> {gymRow.goal}
        </p>
        <p>
          <strong>Training Days:</strong> {gymRow.days} days per week
        </p>
        <p>
          <strong>Training Location:</strong> {gymRow.location}
        </p>
      </section>

      <hr />

      <div ref={plansRef}>
        {workouts.map((plan, index) => {
          const CategoryIcon = categoryIcons[plan.category];

          return (
            <div
              key={index}
              className={`plan-card
              ${tempPickedIndex === index ? 'picked-preview' : ''}
              ${expandedIndex === index ? 'expanded' : ''}
            `}
              onClick={() => handleExpandAndPick(index)}
            >
              <div className="plan-header">
                <div
                  className={`icon-small-div ${tempPickedIndex === index ? 'picked' : ''}`}
                >
                  <CategoryIcon className="icon-small" />
                </div>

                <div className="plan-title">
                  <h3>Plan {index + 1}</h3>
                  <p style={{ color: 'white' }}>
                    <strong>Summary:</strong> {plan.plan_summary}
                  </p>

                  {expandedIndex === index && Array.isArray(plan.expect) && (
                    <div className="plan-expanded">
                      <ul className="custom-list">
                        {plan.expect.map((ex, i) => (
                          <li key={i}>
                            <CategoryIcon className="icon-bullet" />
                            <span style={{ color: 'white' }}>{ex}</span>
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
      </div>

      <div className="plan-action">
        <button
          className="pick-button"
          disabled={tempPickedIndex === null || saving}
          onClick={(e) => {
            e.stopPropagation();
            handleConfirmPick();
          }}
        >
          {saving ? 'Saving...' : 'Confirm workout'}
        </button>
      </div>
    </div>
  );
}
