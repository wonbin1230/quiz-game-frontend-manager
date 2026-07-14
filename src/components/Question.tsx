import React from 'react';

import { useQuestionStore } from '../stores/questionStore';
import { useTypingText } from '../hooks/useTypingText';

interface IProps {
  question: string,
}

const Question = () => {
  const { question } = useQuestionStore();
  const displayText = useTypingText(
    question.question,
    100
  );

  return (
    <div className='flex-6'>
      <div className='flex items-center justify-center h-full w-full rounded-lg border-4 border-red-500 text-6xl'>
        {displayText}
      </div>
    </div>
  );
};

export default Question;