import React from 'react';

import { useSessionStore } from '../stores/sessionStore';
import { SessionState } from '../types/session';
import { CreateRoom } from '../socket/events/room';

const CreateRoomButton = () => {
  const session = useSessionStore((s) => s.state);

  return (
    <>
    <div className='flex flex-12 items-center justify-center'>
      <button
        className='btn btn-soft btn-success btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl text-2xl px-6! py-3!'
        onClick={CreateRoom} disabled={session !== SessionState.LoggedIn}
      >
        創建房間
      </button>
    </div>
    </>
  );
};

export default CreateRoomButton;
