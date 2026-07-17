import React from 'react';
import SettleOption from './SettleOption';

import { useGameStore } from '../stores/gameStore';

const Settle = () => {
  const question = useGameStore((s) => s.question);
  const settle = useGameStore((s) => s.settle);
  const answerReveal = useGameStore((s) => s.answerReveal);

  const labels = ['A', 'B', 'C', 'D'];

  if (!settle) return null;

  return (
    <div className='h-full'>
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-2">
        {question.options.map((opt, index) => {
          const isCorrect =
            answerReveal !== null && answerReveal.correctAnswer === index;

          return (
            <SettleOption
              key={labels[index]}
              label={labels[index]}
              text={opt}
              votes={settle.votes[index] ?? 0}
              totalVotes={settle.totalVotes || 1}
              showAnswerStamp={isCorrect}
              dimmed={answerReveal !== null && !isCorrect}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Settle;
