'use client';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dumbbell, Zap, Trophy } from 'lucide-react';
import { useState } from 'react';

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

      <hr />

      <h2 className="section-title">Your Selected Workout</h2>

      <div className="plan-card picked" onClick={() => setExpanded(!expanded)}>
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
                      {Icon && <Icon className="icon-bullet mt-1 text-blue-500" />}
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
