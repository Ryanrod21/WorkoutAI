'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/button';

const slides = [
  {
    text: [
      'First lets go throught some of the options that is availble to you !',
      'I will be selecting the options to show how things are done !',
    ],
    options: [],
  },
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
    autoPick: 1,
  },
  {
    text: 'Our coach is working on the plans...',
    options: [],
  },
  {
    text: 'Click the Next Button to see the results',
    options: [],
  },
];

const PICK_DELAY = 2200; // wait before radio checks
const NEXT_DELAY = 3600; // wait before moving to next slide

export default function Demo() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [checked, setChecked] = useState(null);

  const slide = slides[slideIndex];
  const isLastSlide = slideIndex === slides.length - 1;

  const navigate = useNavigate();

  useEffect(() => {
    setChecked(null);

    let pickTimer;
    let nextTimer;

    if (slide.autoPick !== undefined) {
      pickTimer = setTimeout(() => {
        setChecked(slide.autoPick);
      }, PICK_DELAY);
    }

    if (!isLastSlide) {
      nextTimer = setTimeout(() => {
        setSlideIndex((prev) => prev + 1);
      }, NEXT_DELAY);
    }

    return () => {
      if (pickTimer) clearTimeout(pickTimer);
      if (nextTimer) clearTimeout(nextTimer);
    };
  }, [slideIndex]);

  return (
    <div className="landing-page">
      <div class="bg-wrapper">
        <div class="glow glow-1"></div>
        <div class="glow glow-2"></div>
      </div>
      <div className="card step-card">
        {Array.isArray(slide.text) ? (
          <div className="intro-text">
            {slide.text.map((line, index) => (
              <h1 key={index} style={{ color: 'black' }}>
                {line}
              </h1>
            ))}
          </div>
        ) : (
          <h1 style={{ color: 'black' }}>{slide.text}</h1>
        )}

        {slide.options.length > 0 && (
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
        )}

        {isLastSlide && (
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Button
              className="demo-next-btn"
              onClick={() => navigate('/demo-agent')}
              label={'See Results →'}
            />
          </div>
        )}
      </div>
    </div>
  );
}
