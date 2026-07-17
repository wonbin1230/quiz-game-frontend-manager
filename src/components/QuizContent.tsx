import React from 'react';

import { useSessionStore } from '../stores/sessionStore';
import { useGameStore } from '../stores/gameStore';
import { SessionState } from '../types/session';
import { GamePhase } from '../types/game';

import Question from './Question';
import OptionArea from './OptionArea';
import Countdown from './Countdown';
import PlayerList from './PlayerList';
import Settle from './Settle';
import NextQuestionButton from './buttons/NextQuestionButton';

const QuizContent = () => {
  const session = useSessionStore((s) => s.state);
  const phase = useGameStore((s) => s.phase);

  const inLobby =
    session === SessionState.InRoom &&
    (phase === GamePhase.Idle || phase === GamePhase.Lobby);

  const inSettle =
    phase === GamePhase.Settle || phase === GamePhase.ShowAnswer;

  return (
    <>
      <div className='relative flex h-full min-h-0 w-[70%] flex-col gap-2 overflow-hidden p-4'>
        {inLobby && <PlayerList />}
        {phase === GamePhase.Voting && <Question />}
        {phase === GamePhase.Voting && <OptionArea />}
        {phase === GamePhase.Voting && <Countdown />}
        {inSettle && (
          <div className='flex min-h-0 flex-1 flex-col gap-6'>
            <div className='min-h-0 flex-1'>
              <Settle />
            </div>
            <div className='flex h-14 shrink-0 items-center justify-center'>
              <NextQuestionButton />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default QuizContent;
