import React from 'react';
import SettleOption from './SettleOption';

import { useGameStore } from '../stores/gameStore';

const Settle = () => {
  const question = useGameStore((s) => s.question);
  const settle = useGameStore((s) => s.settle);
  const answerReveal = useGameStore((s) => s.answerReveal);

  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-yellow-400',
    'bg-green-500',
  ];
  const labels = ['A', 'B', 'C', 'D'];

  if (!settle) return null;

  return (
    <div className='flex-4'>
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-2">
        {question.options.map((opt, index) => (
          <SettleOption
            key={labels[index]}
            label={labels[index]}
            text={opt}
            votes={settle.votes[index] ?? 0}
            totalVotes={settle.totalVotes || 1}
            color={colors[index]}
            showAnswerStamp={
              answerReveal !== null && answerReveal.correctAnswer === index
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Settle;
