import React from 'react';

import { FinishGame } from '../../socket/events/room';
import GameButton from './GameButton';

const FinishGameButton = () => {
  return (
    <div className="flex items-center justify-center">
      <GameButton onClick={FinishGame}>
        結束遊戲
      </GameButton>
    </div>
  );
};

export default FinishGameButton;
