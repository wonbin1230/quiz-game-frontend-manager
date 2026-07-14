import React, { useEffect } from 'react';

import { useClientStateStore } from '../stores/clientStateStore';
import { ClientState } from '../types/client-state';
import CreateRoomButton from './CreateRoomButton';
import Question from './Question';
import OptionArea from './OptionArea';
import Countdown from './Countdown';
import PlayerList from './PlayerList';

const QuizContent = () => {
  const { state } = useClientStateStore();

  return (
    <>
      <div className='relative flex h-full w-[70%] flex-col gap-2 rounded-xl border-4 border-yellow-400 bg-base-200 p-4 shadow-md'>
        { state === ClientState.LoggedIn && <CreateRoomButton /> }
        { state === ClientState.RoomCreated && <PlayerList /> }
        { state === ClientState.Voting && <Question/> }
        { state === ClientState.Voting && <OptionArea/> }
        { state === ClientState.Voting && <Countdown/> }
      </div>
    </>
  );
};

export default QuizContent;