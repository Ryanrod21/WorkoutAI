'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function SelectedWorkout() {
  const [workout, setWorkout] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkout = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('gym')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) return console.error(error);
      setWorkout(data);
    };

    fetchWorkout();
  }, []);

  if (!workout) {
    return <div style={{ padding: 40 }}>Loading workout...</div>;
  }

  const selectedIndex = workout.selected_plan_index;
  const selectedPlan =
    selectedIndex !== null ? workout.plans[selectedIndex] : null;

  const otherPlans = workout.plans.filter(
    (_, index) => index !== selectedIndex
  );

  const switchPlan = async (newIndex) => {
    setSaving(true);

    await supabase
      .from('gym')
      .update({
        selected_plan_index: newIndex,
        selected_plan: workout.plans[newIndex],
      })
      .eq('id', workout.id);

    setWorkout((prev) => ({
      ...prev,
      selected_plan_index: newIndex,
      selected_plan: prev.plans[newIndex],
    }));

    setSaving(false);
  };

  const handleResults = () => {
    navigate('/results');
  };

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ color: 'white' }}>Your Workout Plan</h1>

      {/* ✅ SELECTED PLAN — EXPANDED */}
      {selectedPlan && (
        <section
          style={{
            border: '2px solid #28a745',
            borderRadius: 10,
            padding: 24,
            backgroundColor: '#e6ffed',
            marginBottom: 40,
          }}
        >
          <h2 style={{ marginBottom: 10 }}>Selected Workout</h2>

          <p>
            <strong>Summary:</strong> {selectedPlan.plan_summary}
          </p>

          {selectedPlan.weekly_plan && (
            <>
              <h3>Weekly Overview</h3>
              <pre
                style={{
                  backgroundColor: '#f1f1f1',
                  padding: 12,
                  borderRadius: 6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedPlan.weekly_plan}
              </pre>
            </>
          )}

          <h3>Daily Breakdown</h3>

          {selectedPlan.days.map((day, dayIndex) => (
            <div
              key={dayIndex}
              style={{
                marginBottom: 20,
                padding: 16,
                backgroundColor: '#ffffff',
                borderRadius: 8,
                border: '1px solid #ddd',
              }}
            >
              <h4>
                {day.day} — {day.focus}
              </h4>

              {day.exercises.map((exercise, exIndex) => (
                <div
                  key={exIndex}
                  style={{
                    marginTop: 10,
                    padding: 10,
                    border: '1px solid #eee',
                    borderRadius: 6,
                  }}
                >
                  <strong>{exercise.name}</strong>
                  <p>Reps/Sets: {exercise.reps_sets}</p>
                  <p>Notes: {exercise.notes}</p>
                </div>
              ))}
            </div>
          ))}
        </section>
      )}

      {/* 🔁 OTHER PLANS — COLLAPSED */}
      <h2 style={{ color: 'white' }}>Other Saved Plans</h2>

      {otherPlans.map((plan, index) => {
        const realIndex = workout.plans.indexOf(plan);

        return (
          <div
            key={index}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <h4 style={{ color: 'white' }}>{plan.plan_summary}</h4>

            <button
              disabled={saving}
              onClick={() => switchPlan(realIndex)}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '8px 14px',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Switch to this plan
            </button>
          </div>
        );
      })}

      <button onClick={handleResults}>Back to results</button>
    </div>
  );
}
