'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Zap, Trophy } from 'lucide-react';
import Button from '../components/button';

export default function SelectedWorkout() {
  const [gymRow, setGymRow] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [dayStatus, setDayStatus] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [expandedDayIndex, setExpandedDayIndex] = useState(null);

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

      if (error) {
        console.error(error);
        return;
      }

      setGymRow(data);
      const extractedWorkouts = data.plans?.[0]?.plans ?? [];
      setWorkouts(extractedWorkouts);

      if (data.day_status) {
        setDayStatus(data.day_status);
      }
    };

    fetchWorkout();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!gymRow) return;

    const interval = setInterval(() => {
      const unlockTime =
        new Date(gymRow.created_at).getTime() + 7 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      setTimeRemaining(Math.max(unlockTime - now, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [gymRow]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // if click is outside any card
      if (!event.target.closest('.plan-card')) {
        setExpandedDayIndex(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (!gymRow || workouts.length === 0) {
    return <div style={{ padding: 40 }}>Loading workout...</div>;
  }

  const selectedPlan = gymRow.selected_plan;

  if (!selectedPlan) {
    return <div style={{ padding: 40 }}>No workout selected.</div>;
  }

  const categoryIcons = {
    'Strength Builder': Dumbbell,
    'Endurance Elite': Zap,
    'Athletic Performance': Trophy,
  };

  const Icon = categoryIcons[selectedPlan.category];

  const toggleDayStatus = async (dayIndex, status) => {
    setDayStatus((prev) => {
      const updatedDays = { ...prev, [dayIndex]: status };

      // Save to Supabase immediately
      if (gymRow?.id) {
        supabase
          .from('gym')
          .update({ day_status: updatedDays })
          .eq('id', gymRow.id)
          .then(({ error }) => {
            if (error) console.error('Failed to save day status', error);
          });
      }

      return updatedDays;
    });
  };

  const totalDays = selectedPlan.days.length;
  const completedDays = Object.values(dayStatus).filter(
    (v) => v === true || v === false,
  ).length;

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const handleResults = () => {
    navigate('/results');
  };

  const handleNextWeek = async () => {
    // 4️⃣ Navigate to progress page
    navigate('/progress');
  };

  return (
    <div className="page-container">
      <h1>Your Workout Plan</h1>

      <div className="icon-center">
        <h3>{selectedPlan.category}</h3>
        <div className="icon-med-div">
          <Icon className="icon-med" />
        </div>
      </div>

      <h2 className="section-title">Selected Workout</h2>
      <h3 className="section-title">Daily Breakdown</h3>
      <hr />

      {selectedPlan.days.map((day, dayIndex) => (
        <div
          key={dayIndex}
          className={`plan-card day-card picked ${expandedDayIndex === dayIndex ? 'expanded' : ''}`}
          onClick={() => {
            if (expandedDayIndex !== dayIndex) {
              setExpandedDayIndex(dayIndex);
            }
          }}
        >
          <div className="select-header">
            <div
              className={`plan-title ${expandedDayIndex === dayIndex ? 'expanded' : ''}`}
            >
              <h4 className="day-title">
                {day.day} — {day.focus}
              </h4>
            </div>
            {expandedDayIndex !== dayIndex && (
              <div
                className={`checkbox ${
                  dayStatus[dayIndex] === true
                    ? 'checked'
                    : dayStatus[dayIndex] === false
                      ? 'failed'
                      : ''
                }`}
              >
                {dayStatus[dayIndex] === true && (
                  <span className="checkmark">✓</span>
                )}
                {dayStatus[dayIndex] === false && (
                  <span className="xmark">✕</span>
                )}
              </div>
            )}
          </div>

          {expandedDayIndex === dayIndex && (
            <div className="day-exercises">
              {day.exercises.map((exercise, exIndex) => (
                <div key={exIndex} className="exercise-card">
                  <div>
                    <Icon className="icon-bullet" />
                    <strong className="exercise-name">{exercise.name}</strong>
                  </div>
                  <p className="exercise-reps">
                    Reps/Sets: {exercise.reps_sets}
                  </p>
                  <p className="exercise-notes">Notes: {exercise.notes}</p>
                </div>
              ))}

              <div className="finished-wrapper">
                <label
                  className="checkbox-label"
                  onClick={() => toggleDayStatus(dayIndex, true)}
                >
                  <div
                    className={`checkbox ${dayStatus[dayIndex] === true ? 'checked' : ''}`}
                  >
                    {dayStatus[dayIndex] === true && (
                      <span className="checkmark">✓</span>
                    )}
                  </div>
                  <span className="label-text">Finished Workout</span>
                </label>

                <label
                  className="checkbox-label"
                  onClick={() => toggleDayStatus(dayIndex, false)}
                >
                  <div
                    className={`checkbox ${dayStatus[dayIndex] === false ? 'failed' : ''}`}
                  >
                    {dayStatus[dayIndex] === false && (
                      <span className="xmark">✕</span>
                    )}
                  </div>
                  <span className="label-text">Didn't Finish</span>
                </label>
              </div>
            </div>
          )}
        </div>
      ))}

      <Button
        className="secondary-button"
        onClick={handleResults}
        label="Back to results"
      />

      <div className="next-week-wrapper">
        <Button
          label="Next Week Workout"
          // disabled={timeRemaining > 0 || completedDays < totalDays}
          onClick={handleNextWeek}
        />
        {(timeRemaining > 0 || completedDays < totalDays) && (
          <p className="unlock-info">
            Unlocks in {formatTime(timeRemaining)}
            <br />
            Progress: {completedDays}/{totalDays} completed
          </p>
        )}
      </div>
    </div>
  );
}
