import React, { useEffect, useState } from 'react';
import Option from './Option';

import { useQuestionStore } from '../stores/gameStore';

const OptionArea = () => {
  const { question } = useQuestionStore();
  const [activeIndex, setActiveIndex] = useState(0);

  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-yellow-400',
    'bg-green-500',
  ];
  const labels = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    const optionCount = question.options.length;
    if (optionCount === 0) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % optionCount);
    }, 200);

    return () => clearInterval(timer);
  }, [question.options.length]);

	return (
    <div className='flex-4'>
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-2">
        {question.options.map((opt, index) => (
          <Option
            key={labels[index]}
            label={labels[index]}
            text={opt}
            color={colors[index]}
            highlighted={index === activeIndex}
          />
        ))}
      </div>
    </div>
	);
};

export default OptionArea;
