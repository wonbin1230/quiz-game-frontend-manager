import React from 'react';

import { useClientStateStore } from '../stores/clientStateStore';
import { ClientState } from '../types/client-state';
import { StartGame } from '../socket/events/room';

const StartGameButton = () => {
  const { state } = useClientStateStore();

  return (
    <>
    <div className='flex items-center justify-center'>
      <button
        className='btn btn-soft btn-success btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl text-2xl px-6! py-3!'
        disabled={state !== ClientState.RoomCreated}
        onClick={StartGame}
      >
        開始遊戲
      </button>
    </div>
    </>
  );
};

export default StartGameButton;
