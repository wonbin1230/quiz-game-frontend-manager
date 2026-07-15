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
      <div className='flex items-center justify-center h-full w-full text-6xl'>
        {displayText}
      </div>
    </div>
  );
};

export default Question;
