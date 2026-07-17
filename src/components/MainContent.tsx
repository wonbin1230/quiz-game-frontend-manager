import React from 'react';

import { useSessionStore } from '../stores/sessionStore';
import { useGameStore } from '../stores/gameStore';
import { SessionState } from '../types/session';
import { GamePhase } from '../types/game';
import QuizContent from './QuizContent';
import Picture from './Picture';
import DanmakuOverlay from './DanmakuOverlay';

const MainContent = () => {
  const session = useSessionStore((s) => s.state);
  const phase = useGameStore((s) => s.phase);

  const showDanmaku =
    session === SessionState.InRoom &&
    (phase === GamePhase.Idle || phase === GamePhase.Lobby);

  return (
    <>
      <div className='relative flex h-screen items-center justify-center p-8!'>
        {showDanmaku && <DanmakuOverlay />}
        {/* <Picture src='/left.png' alt='left' /> */}
        {/* <Picture src='/right.png' alt='right' /> */}
        <QuizContent />
      </div>
    </>
  );
};

export default MainContent;
