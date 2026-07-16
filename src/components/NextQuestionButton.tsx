import React from 'react';
import { motion } from 'framer-motion';

import { useGameStore } from '../stores/gameStore';
import { GamePhase } from '../types/game';
import { NextQuestion } from '../socket/events/room';
import { ANSWER_STAMP_DURATION } from './AnswerStamp';

const NextQuestionButton = () => {
  const phase = useGameStore((s) => s.phase);
  const questionIndex = useGameStore((s) => s.question.questionIndex);
  const totalQuestions = useGameStore((s) => s.question.totalQuestions);

  const isLastQuestion = questionIndex >= totalQuestions - 1;

  if (phase !== GamePhase.ShowAnswer || isLastQuestion) return null;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: ANSWER_STAMP_DURATION,
        duration: 1,
        ease: 'easeOut',
      }}
    >
      <button
        className="pointer-events-auto btn btn-soft btn-success btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl text-2xl px-6! py-3!"
        onClick={NextQuestion}
      >
        繼續往幸福邁進
      </button>
    </motion.div>
  );
};

export default NextQuestionButton;
