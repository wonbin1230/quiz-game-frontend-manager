import React from 'react';

import { useSessionStore } from '../../stores/sessionStore';
import { SessionState } from '../../types/session';
import { CreateRoom } from '../../socket/events/room';
import GameButton from './GameButton';

const CreateRoomButton = () => {
  const session = useSessionStore((s) => s.state);
  const canCreate = session === SessionState.LoggedIn;

  return (
    <div className='flex items-center justify-center'>
      <GameButton onClick={CreateRoom} disabled={!canCreate}>
        我們結婚吧
      </GameButton>
    </div>
  );
};

export default CreateRoomButton;
