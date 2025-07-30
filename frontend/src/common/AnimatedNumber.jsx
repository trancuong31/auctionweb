import { useEffect, useState } from "react";

const Digit = ({ digit, height }) => {
  return (
    <div className="digit-container" style={{ height }}>
      <div
        className="digit-strip"
        style={{ transform: `translateY(-${digit * height}px)` }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="digit" style={{ height }}>
            {i}
          </div>
        ))}
      </div>
    </div>
  );
};

const AnimatedCounter = ({ value, height = 24, duration = 500 }) => {
  const [digits, setDigits] = useState([]);

  useEffect(() => {
    if (value == null) return;
    const numberStr = value.toString().padStart(1, "0");
    setDigits(numberStr.split("").map(Number));
  }, [value]);

  return (
    <div className="animated-counter" style={{ height }}>
      {digits.map((d, idx) => (
        <Digit key={idx} digit={d} height={height} />
      ))}
    </div>
  );
};

export default AnimatedCounter;
