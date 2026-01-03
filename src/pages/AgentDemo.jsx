import { useState } from 'react';

export default function AgentDemo() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [pickedIndex, setPickedIndex] = useState(null);
  const [saving, setSaving] = useState(false);

  const userName = 'New User !';

  const state = {
    goal: 'Build Muscle',
    days: 3,
    location: 'Gym',
    plans: [
      {
        plan_summary:
          'Upper / Lower split focused on compound lifts and progressive overload.',
      },
      {
        plan_summary:
          'Push / Pull / Legs routine designed for hypertrophy and strength.',
      },
      {
        plan_summary:
          'Full-body training with higher frequency and balanced recovery.',
      },
    ],
  };

  const handleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handlePick = (index) => {
    setSaving(true);

    setTimeout(() => {
      setPickedIndex(index);
      setSaving(false);
    }, 600);
  };

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
      <div class="bg-wrapper">
        <div class="glow glow-1"></div>
        <div class="glow glow-2"></div>
      </div>
      <h1 style={{ color: 'white' }}>Your Workout Summary</h1>
      <h2 style={{ color: 'white' }}>Welcome, {userName}</h2>

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

      <h2 style={{ color: 'white', margin: '20px 0' }}>
        AI Suggested Workout Plans
      </h2>

      {state.plans.map((plan, index) => (
        <div
          key={index}
          onClick={() => handleExpand(index)}
          style={{
            color: 'white',
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
              pickedIndex === index ? '#e6ffed' : 'rgba(0, 0, 0, 0.562)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          <h3>Plan {index + 1}</h3>
          <p style={{ color: 'white' }}>
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
