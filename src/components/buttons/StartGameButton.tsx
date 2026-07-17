import React from 'react';

import { useSessionStore } from '../../stores/sessionStore';
import { useGameStore } from '../../stores/gameStore';
import { SessionState } from '../../types/session';
import { GamePhase } from '../../types/game';
import { StartGame } from '../../socket/events/room';
import GameButton from './GameButton';

const StartGameButton = () => {
  const session = useSessionStore((s) => s.state);
  const phase = useGameStore((s) => s.phase);

  const canStart = session === SessionState.InRoom && phase === GamePhase.Idle;

  return (
    <div className='flex items-center justify-center'>
      <GameButton disabled={!canStart} onClick={StartGame}>
        開始遊戲
      </GameButton>
    </div>
  );
};

export default StartGameButton;
