import React from 'react';

import { useSessionStore } from '../stores/sessionStore';
import { useGameStore } from '../stores/gameStore';
import { SessionState } from '../types/session';
import { GamePhase } from '../types/game';
import QuizContent from './QuizContent';
import Picture from './Picture';
import DanmakuOverlay from './DanmakuOverlay';
import Countdown from './Countdown';

const MainContent = () => {
  const session = useSessionStore((s) => s.state);
  const phase = useGameStore((s) => s.phase);
  const questionIndex = useGameStore((s) => s.question.questionIndex);
  const totalQuestions = useGameStore((s) => s.question.totalQuestions);
  const quizCount = useGameStore((s) => s.quizCount);

  const showDanmaku =
    session === SessionState.InRoom &&
    (phase === GamePhase.Idle || phase === GamePhase.Lobby);

  const inQuestion =
    phase === GamePhase.Voting ||
    phase === GamePhase.Settle ||
    phase === GamePhase.ShowAnswer;
  const total = totalQuestions || quizCount;
  const showProgress = inQuestion && questionIndex > 0 && total > 0;

  return (
    <>
      <div className='relative flex h-screen items-center justify-center p-8!'>
        {showDanmaku && <DanmakuOverlay />}
        {(showProgress || phase === GamePhase.Voting) && (
          <div className='pointer-events-none absolute inset-x-0 top-3 z-40 flex flex-col items-center gap-2'>
            {showProgress && (
              <div className='text-2xl font-bold tracking-[0.12em] text-gold'>
                {questionIndex}/{total}
              </div>
            )}
            {phase === GamePhase.Voting && <Countdown />}
          </div>
        )}
        {/* <Picture src='/left.png' alt='left' /> */}
        {/* <Picture src='/right.png' alt='right' /> */}
        <QuizContent />
      </div>
    </>
  );
};

export default MainContent;
