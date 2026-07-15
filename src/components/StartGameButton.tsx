import React from 'react';

import { useSessionStore } from '../stores/sessionStore';
import { useGameStore } from '../stores/gameStore';
import { SessionState } from '../types/session';
import { GamePhase } from '../types/game';
import { StartGame } from '../socket/events/room';

const StartGameButton = () => {
  const session = useSessionStore((s) => s.state);
  const phase = useGameStore((s) => s.phase);

  const canStart = session === SessionState.InRoom && phase === GamePhase.Idle;

  return (
    <>
    <div className='flex items-center justify-center'>
      <button
        className='btn btn-soft btn-success btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl text-2xl px-6! py-3!'
        disabled={!canStart}
        onClick={StartGame}
      >
        開始遊戲
      </button>
    </div>
    </>
  );
};

export default StartGameButton;
