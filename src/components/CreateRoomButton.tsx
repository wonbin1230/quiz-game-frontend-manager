import React from 'react';

import { useClientStateStore } from '../stores/clientStateStore';
import { ClientState } from '../types/client-state';
import { CreateRoom } from '../socket/events/room';

const CreateRoomButton = () => {
  const { state } = useClientStateStore();

  return (
    <>
    <div className='flex flex-12 items-center justify-center'>
      <button
        className='btn btn-soft btn-success btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl text-2xl px-6! py-3!'
        onClick={CreateRoom} disabled={state !== ClientState.LoggedIn}
      >
        創建房間
      </button>
    </div>
    </>
  );
};

export default CreateRoomButton;