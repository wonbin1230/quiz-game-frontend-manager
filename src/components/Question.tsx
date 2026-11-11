import React from 'react';

import { useGameStore } from '../stores/gameStore';
import { useTypingText } from '../hooks/useTypingText';

const Question = () => {
  const question = useGameStore((s) => s.question);
  const displayText = useTypingText(
    question.question,
    100
  );

  return (
    <div className='flex-6'>
      <div className='flex h-full w-full items-center justify-center px-4 text-center text-4xl font-bold tracking-[0.15em] text-ink'>
        {displayText}
      </div>
    </div>
  );
};

export default Question;
