import React from 'react';
import { motion } from 'framer-motion';

import { useGameStore } from '../../stores/gameStore';
import { GamePhase } from '../../types/game';
import { NextQuestion } from '../../socket/events/room';
import { ANSWER_STAMP_DURATION } from '../AnswerStamp';
import GameButton from './GameButton';

const NextQuestionButton = () => {
  const phase = useGameStore((s) => s.phase);
  const questionIndex = useGameStore((s) => s.question.questionIndex);
  const totalQuestions = useGameStore((s) => s.question.totalQuestions);

  const isLastQuestion = questionIndex >= totalQuestions - 1;

  if (phase !== GamePhase.ShowAnswer) return null;

  return (
    <motion.div
      className="flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: ANSWER_STAMP_DURATION,
        duration: 1,
        ease: 'easeOut',
      }}
    >
      <GameButton onClick={NextQuestion}>
        {isLastQuestion ? '抵達幸福' : '繼續往幸福邁進'}
      </GameButton>
    </motion.div>
  );
};

export default NextQuestionButton;
