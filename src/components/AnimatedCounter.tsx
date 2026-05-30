import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number; // defaults to 1400ms (within 1.2-1.6s range)
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

// Cubic ease-out function
const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1400,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = ''
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;
    const endValue = value;

    if (endValue === 0) {
      setCount(0);
      return;
    }

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = easeOutCubic(progress);
      const currentVal = startValue + (endValue - startValue) * easedProgress;

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [value, duration]);

  // Format the number nicely with local separators if needed
  const formattedNumber = count.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  return (
    <span className={className}>
      {prefix}{formattedNumber}{suffix}
    </span>
  );
};
