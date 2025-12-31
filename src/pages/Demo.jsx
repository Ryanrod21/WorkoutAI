import { useEffect, useState } from 'react';

const slides = [
  {
    text: 'Select your fitness goal',
    options: ['Lose Fat', 'Build Muscle', 'Run a Marthon', 'Bodybuilding'],
    autoPick: 1,
  },
  {
    text: 'How many days do you want to train ?',
    options: ['3', '4', '5', '6'],
    autoPick: 0,
  },
  {
    text: 'Where are you training ?',
    options: ['Home', 'Gym', 'Outside'],
    autoPick: 2,
  },
  {
    text: 'Comparing workout plans...',
    options: [],
  },
];

const PICK_DELAY = 1200; // wait before radio checks
const NEXT_DELAY = 2600; // wait before moving to next slide

export default function Demo() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [checked, setChecked] = useState(null);

  const slide = slides[slideIndex];

  useEffect(() => {
    setChecked(null);

    if (slide.autoPick === undefined) return;

    const pickTimer = setTimeout(() => {
      setChecked(slide.autoPick);
    }, PICK_DELAY);

    const nextTimer = setTimeout(() => {
      if (slideIndex < slides.length - 1) {
        setSlideIndex((prev) => prev + 1);
      }
    }, NEXT_DELAY);

    return () => {
      clearTimeout(pickTimer);
      clearTimeout(nextTimer);
    };
  }, [slideIndex]);

  return (
    <div className="landing-page">
      <div className="card step-card">
        <h1 style={{ color: 'black' }}>{slide.text}</h1>
        <div className="radio-group">
          {slide.options.map((option, index) => (
            <label
              key={option}
              className={`demo-option ${checked === index ? 'active' : ''}`}
            >
              <input type="radio" checked={checked === index} readOnly />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
