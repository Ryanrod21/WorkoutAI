'use client';

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/button';
import BackgroundEffect from '../components/UI/BackgroundEffect';

const slides = [
  {
    dialogue: `First lets go through some of the options that are available to you.
    I will be selecting the options to show how things are done!`,
    options: [],
    intro: true,
  },
  {
    text: 'Select your fitness goal',
    options: [
      'Lose Weight',
      'Build Muscle',
      'Improve Endurance',
      'Genral Fitness',
    ],
    dialogue: `First I'm going to Select my Fitness Goal.`,
    autoPick: 1,
  },
  {
    text: 'What is your fitness experience level?',
    options: [
      'Beginner - New to working out',
      'Intermediate - 1-2 years experience',
      'Advanced - 3+ years experience',
      'Athelete - Professional Level',
    ],
    dialogue: `Then I'm going to select my fitness experience.`,
    autoPick: 1,
  },
  {
    text: 'How many days per week can you commit?',
    options: [
      '3 days per week',
      '4 days per week',
      '5 days per week',
      '6 days per week',
    ],
    dialogue: `Now I'm going to select how many days I want to workout.`,
    autoPick: 0,
  },
  {
    text: 'How long can you workout per session? ',
    options: ['30 minutes', '45 minutes', '60 minutes', '90+ minutes'],
    dialogue: `Next I'm going to select how many minutes I want to workout`,
    autoPick: 2,
  },
  {
    text: 'Where do you prefer to workout?',
    options: [
      'Gym with equipment',
      'Home with minimal equipment',
      'Outdoor activities',
      'Mixed / Flexible',
    ],
    dialogue: `I'm going to pick the place I'm going to do my workouts `,
    autoPick: 1,
  },
  {
    text: 'Our coach is working on the plans...',
    dialogue: 'Now lets wait for our coach design our plan',
    options: [],
  },
  {
    text: 'Click the Next Button to see the results',
    options: [],
  },
];

const PICK_DELAY = 6200; // wait before radio checks
const NEXT_DELAY = 7600; // wait before moving to next slide

export default function Demo() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [checked, setChecked] = useState(null);
  const [typedText, setTypedText] = useState('');

  const navigate = useNavigate();

  const TOTAL_QUESTIONS = slides.length - 1; // exclude intro

  const progressPercent =
    slideIndex === 0 ? 0 : Math.round((slideIndex / TOTAL_QUESTIONS) * 100);

  const slide = slides[slideIndex];
  const isLastSlide = slideIndex === slides.length - 1;

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

  // ===================
  // Typing Effect Below
  // ===================

  const typingIndexRef = useRef(0);
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    if (!slide.dialogue) {
      setTypedText('');
      return;
    }

    setTypedText('');
    typingIndexRef.current = 0;

    typingIntervalRef.current = setInterval(() => {
      const i = typingIndexRef.current;

      if (i >= slide.dialogue.length) {
        clearInterval(typingIntervalRef.current);
        return;
      }

      setTypedText((prev) => prev + slide.dialogue.charAt(i));
      typingIndexRef.current += 1;
    }, 35);

    return () => {
      clearInterval(typingIntervalRef.current);
    };
  }, [slideIndex]);

  useEffect(() => {
    return () => setTypedText('');
  }, [slideIndex]);

  return (
    <div className="landing-page">
      <BackgroundEffect />
      <div className="card step-card">
        {slideIndex > 0 && (
          <div className="progress-wrapper">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="progress-text">{progressPercent}%</span>
          </div>
        )}

        {slide.dialogue && (
          <div
            className={`dialogue-box ${slide.intro ? 'dialogue-intro' : ''}`}
          >
            <span className="dialogue-text">{typedText}</span>
            {!slide.intro && <span className="typing-cursor">|</span>}
          </div>
        )}

        {slide.text && (
          <h1 className={slide.intro ? 'intro-title' : 'slide-title'}>
            {slide.text}
          </h1>
        )}

        {slide.options.length > 0 && (
          <div className="radio-group">
            {slide.options.map((option, index) => (
              <label key={option} className="radio-option">
                <input type="radio" checked={checked === index} readOnly />
                <span className="radio-circle"></span>
                <span className="radio-text">{option}</span>
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
