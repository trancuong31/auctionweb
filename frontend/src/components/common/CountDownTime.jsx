import React, { useEffect, useState } from "react";

const CountdownTimer = ({ targetTime }) => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const distance = new Date(targetTime).getTime() - now;
    if (distance <= 0) return null;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  if (!timeLeft) return <span className="countdown-ended"></span>;

  const { days, hours, minutes, seconds } = timeLeft;
  return (
    <div className="countdown-timer">
     {days}d {hours}h {minutes}m {seconds}s
    </div>
  );
};

export default CountdownTimer;