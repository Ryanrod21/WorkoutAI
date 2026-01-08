'use client';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dumbbell, Zap, Trophy } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/button';

const ICONS = { Dumbbell, Zap, Trophy };

export default function DemoSelection() {
  const [expanded, setExpanded] = useState(false); // single expand toggle

  const locationHook = useLocation();
  const navigate = useNavigate();

  const {
    userName,
    selectedPlan,
    goal,
    days,
    expect,
    location: trainingLocation,
  } = locationHook.state || {};

  if (!selectedPlan) {
    navigate('/');
    return null;
  }

  const Icon = ICONS[selectedPlan.iconName] || null;

  const handleSignIn = () => {
    navigate('/sign-up');
  };

  return (
    <div className="page-container">
      <h1>Workout Results</h1>
      <h2>Welcome, {userName}</h2>

      <section className="section-results">
        <p>
          <strong>Goal:</strong> {goal}
        </p>
        <p>
          <strong>Training Days:</strong> {days} days per week
        </p>
        <p>
          <strong>Training Location:</strong> {trainingLocation}
        </p>
      </section>

      <h2 className="section-title">Your Selected Workout</h2>
      <hr />

      <div className="plan-card picked" style={{transform: 'none'}} onClick={() => setExpanded(!expanded)}>
        <div className="plan-header">
          <div className="icon-small-div picked">
            {Icon && <Icon className="icon-small picked" />}
          </div>

          <div className="plan-title">
            <h3>{selectedPlan.plan}</h3>
            <p>{selectedPlan.detail}</p>

            <p className="plan-summary">
              <strong>Summary:</strong> {selectedPlan.plan_summary}
            </p>

            {/* Expanded content */}
            {expanded && Array.isArray(selectedPlan.expect) && (
              <div className="plan-expanded mt-2">
                <ul className="custom-list list-none pl-0">
                  {selectedPlan.expect.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 mb-1">
                      {Icon && (
                        <Icon className="icon-bullet mt-1 text-blue-500" />
                      )}
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        {expanded && (
          <div className="blur-card">
            <Button
              className="blur-btn"
              label={'Sign Up Now To Unlock more'}
              onClick={handleSignIn}
            />
            <div className="blur-div">
              <h1 className="blurred-text">
                Day 1: Upper Body Strength Training
              </h1>

              <p className="blurred-text">
                Bench Press - 4 sets of 8 reps. Focus on controlled movement,
                keeping your feet planted and your core engaged throughout each
                rep.
              </p>

              <p className="blurred-text">
                Pull-Ups - 3 sets of 10 reps. Use a full range of motion,
                squeezing your back muscles at the top and lowering yourself
                slowly.
              </p>

              <p className="blurred-text">
                Shoulder Press - 3 sets of 12 reps. Maintain an upright posture
                and avoid locking your elbows at the top of the movement.
              </p>

              <p className="blurred-text">
                Bicep Curls - 3 sets of 15 reps. Keep your elbows close to your
                sides and focus on slow, controlled curls for maximum muscle
                activation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
