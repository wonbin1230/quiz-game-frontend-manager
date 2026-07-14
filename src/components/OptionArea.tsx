import React from 'react';
import Option from './Option';

import { useQuestionStore } from '../stores/questionStore';

interface IOptionData {
  label: string,
  text: string,
  votes: number,
}

interface IProps {
  options: string[],
}

const OptionArea = () => {
  const { question } = useQuestionStore();

  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-yellow-400',
    'bg-green-500',
  ];
  const labels = ['A', 'B', 'C', 'D'];
  const votes = [10, 20, 60, 10];

	return (
    <div className='flex-4'>
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-2">
        {question.options.map((opt, index) => (
          <Option
            key={labels[index]}
            label={labels[index]}
            text={opt}
            votes={votes[index]}
            totalVotes={100}
            color={colors[index]}
          />
        ))}
      </div>
    </div>
	);
};

export default OptionArea;