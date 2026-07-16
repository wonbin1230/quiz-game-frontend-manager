import React from 'react';

import { useSessionStore } from '../stores/sessionStore';
import { useGameStore } from '../stores/gameStore';
import { SessionState } from '../types/session';
import { GamePhase } from '../types/game';

import CreateRoomButton from './CreateRoomButton';
import Question from './Question';
import OptionArea from './OptionArea';
import Countdown from './Countdown';
import PlayerList from './PlayerList';
import Settle from './Settle';

const QuizContent = () => {
  const session = useSessionStore((s) => s.state);
  const phase = useGameStore((s) => s.phase);

  const inLobby =
    session === SessionState.InRoom &&
    (phase === GamePhase.Idle || phase === GamePhase.Lobby);

  return (
    <>
      <div className='relative flex h-full min-h-0 w-[70%] flex-col gap-2 overflow-hidden rounded-xl border-4 border-yellow-400 bg-base-200 p-4 shadow-md'>
        {session === SessionState.LoggedIn && <CreateRoomButton />}
        {inLobby && <PlayerList />}
        {phase === GamePhase.Voting && <Question />}
        {phase === GamePhase.Voting && <OptionArea />}
        {phase === GamePhase.Voting && <Countdown />}
        {phase === GamePhase.Settle && <Settle />}
      </div>
    </>
  );
};

export default QuizContent;
