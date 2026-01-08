import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Zap, Trophy } from 'lucide-react';
import BackgroundEffect from '../components/UI/BackgroundEffect';

export default function AgentDemo() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [pickedIndex, setPickedIndex] = useState(null);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const userName = 'Visiting User !';

  const state = {
    goal: 'Build Muscle',
    days: '2-3 days a week',
    location: 'Gym',
    minutes: '60',
    plans: [
      {
        plan: 'Strength Builder',
        detail: 'Build muscle and power',
        plan_summary:
          'Upper / Lower split focused on compound lifts and progressive overload.',
        icon: Dumbbell,
        iconName: 'Dumbbell',
        expect: [
          'Use weight equipment',
          'Heavy lifts',
          'Starts light then goes heavy for each sets',
          'Mainly gym for gym and or place with weights',
        ],
      },
      {
        plan: 'Athletic Performance',
        detail: 'Speed, agility, and explosiveness',
        plan_summary:
          'Push / Pull / Legs routine designed for hypertrophy and strength.',
        icon: Zap,
        iconName: 'Zap',
        expect: [
          'Not much heavy weights',
          'Focus on exploding',
          'Focus on higher reps',
          'Three day split on each body part that is being work',
        ],
      },
      {
        plan: 'Endurance Elite',
        detail: 'Build stamina and resilience',
        plan_summary:
          'Full-body training with higher frequency and balanced recovery.',
        icon: Trophy,
        iconName: 'Trophy',
        expect: [
          'Use more body weight',
          'Less rest more intense',
          'More cardio',
          'Can be down anywhere with open space',
        ],
      },
    ],
  };

  const handleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handlePick = (index) => {
    setSaving(true);

    setTimeout(() => {
      const plan = state.plans[index];

      // Only pass serializable data (no React components!)
      const serializablePlan = {
        plan: plan.plan,
        detail: plan.detail,
        plan_summary: plan.plan_summary,
        expect: plan.expect,
        iconName: plan.iconName, // <- THIS IS THE KEY FIX
      };

      // console.log('Serializing plan:', serializablePlan); // check here

      navigate('/demo-selection', {
        state: {
          userName,
          selectedPlan: serializablePlan,
          goal: state.goal,
          days: state.days,
          location: state.location,
        },
      });

      setSaving(false);
    }, 600);
  };

  return (
    <div className="page-container">
      <BackgroundEffect />

      <h1>Your Workout Summary</h1>
      <h2>Welcome, {userName}</h2>

      <section className="section-results">
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

      {state.plans.map((plan, index) => {
        const Icon = plan.icon;

        return (
          <div
            key={index}
            className={`plan-card 
            ${pickedIndex === index ? 'picked' : ''}
            ${expandedIndex === index ? 'expanded' : ''}`}
            onClick={() => {
              handleExpand(index); // keep your expand behavior
              setPickedIndex(index); // 🔥 select card for button
            }}
          >
            <div className="plan-header">
              <div
                className={`icon-small-div ${
                  pickedIndex === index ? 'picked' : ''
                }`}
              >
                <Icon
                  className={`icon-small ${
                    pickedIndex === index ? 'picked' : ''
                  }`}
                />
              </div>
              <div className="plan-title">
                <h3>{plan.plan}</h3>
                <p>{plan.detail}</p>

                <p className="plan-summary">
                  <strong>Summary:</strong> {plan.plan_summary}
                </p>

                {expandedIndex === index && Array.isArray(plan.expect) && (
                  <div className="plan-expanded">
                    <ul className="custom-list">
                      {plan.expect.map((e, i) => (
                        <li key={i}>
                          {/* Render the same icon as bullet */}
                          <Icon className="icon-bullet" />
                          <span>{e}</span>
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
