import React from 'react';
import SettleOption from './SettleOption';

import { useQuestionStore, useSettleStore } from '../stores/gameStore';

interface IOptionData {
  label: string,
  text: string,
  votes: number,
}

interface IProps {
  options: string[],
}

const Settle = () => {
  const { question } = useQuestionStore();
  const { settle } = useSettleStore();

  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-yellow-400',
    'bg-green-500',
  ];
  const labels = ['A', 'B', 'C', 'D'];

	return (
    <div className='flex-4'>
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-2">
        {question.options.map((opt, index) => (
          <SettleOption
            key={labels[index]}
            label={labels[index]}
            text={opt}
            votes={settle.votes[index]}
            totalVotes={100}
            color={colors[index]}
          />
        ))}
      </div>
    </div>
	);
};

export default Settle;