import { useState, useEffect, useRef } from 'react';
import { Dumbbell, Zap, Target } from 'lucide-react';
import HomeCard from './Card';
import '../components.css';

const cards = [
  {
    label: 'Tailored plans for your specific fitness objectives',
    title: 'Goal-Driven',
    icon: Target,
  },
  {
    label: 'Plans that evolve with your progress',
    title: 'Adaptive Training',
    icon: Zap,
  },
  {
    label: 'Professional coaching at your fingertips',
    title: 'Expert Guidance',
    icon: Dumbbell,
  },
];

export default function LineUI() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [lineHeight, setLineHeight] = useState(0);
  const containerRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !lineRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;

      // Animate line height based on scroll inside container
      const newHeight = Math.min(
        containerRect.height,
        scrollTop - containerRect.top + 20,
      ); // 20px offset
      setLineHeight(newHeight > 0 ? newHeight : 0);

      // Determine which card is active
      const lineRect = lineRef.current.getBoundingClientRect();
      const lineY = lineRect.top + lineRect.height;

      const cardElements = containerRef.current.querySelectorAll('.home-card');
      let newActive = -1;

      cardElements.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (lineY >= rect.top && lineY <= rect.bottom) {
          newActive = index;
        }
      });

      setActiveIndex(newActive);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="timeline-container">
      {cards.map((card, index) => (
        <HomeCard
          key={index}
          className={`home-card ${activeIndex === index ? 'active' : ''} icon-primary`}
          label={card.label}
          title={card.title}
          icon={card.icon}
        />
      ))}

      <div
        ref={lineRef}
        className="timeline-line-animated"
        style={{ height: `${lineHeight}px` }}
      ></div>
    </div>
  );
}
