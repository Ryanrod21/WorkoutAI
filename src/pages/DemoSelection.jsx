'use client';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dumbbell, Zap, Trophy } from 'lucide-react';

// Map icon names to the actual React components
const ICONS = { Dumbbell, Zap, Trophy };

export default function DemoSelection() {
  const locationHook = useLocation();
  const navigate = useNavigate();

  // check if data exists
  const {
    userName,
    selectedPlan,
    goal,
    days,
    location: trainingLocation, // rename so it doesn't shadow locationHook
  } = locationHook.state || {};

  if (!selectedPlan) {
    // if no selection, go back
    navigate('/');
    return null;
  }

  // Map the icon name back to the component
  const Icon = ICONS[selectedPlan.iconName] || null;

  console.log('Icon component:', Icon); // should now show the React component

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

      <div className="plan-card picked">
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
          </div>
        </div>
        
      </div>
    </div>
  );
}
