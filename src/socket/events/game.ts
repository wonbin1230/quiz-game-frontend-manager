import { GetSocket } from '../client';

import { IServerStartGame, IServerGetQuestion, IServerSettle, ServerGameState } from '../../types/server-response';
import { ClientState } from '../../types/client-state';

import { useClientStateStore } from '../../stores/clientStateStore';
import { useGameStateStore } from '../../stores/gameStateStore';
import { useQuestionStore, useSettleStore } from '../../stores/gameStore';

export const OnGameStarted = () => {
  GetSocket().on('QuizGame:GameStarted', (data: IServerStartGame) => {
    useClientStateStore.getState().setState(ClientState.Voting);
  });
};

export const OnGetQuestion = () => {
  GetSocket().on('QuizGame:Question', (data: IServerGetQuestion) => {
    useQuestionStore.getState().setQuestion({
      questionIndex: data.questionIndex,
      question: data.question,
      options: data.options,
      votingTime: data.votingTime,
    });
  });
};

export const OnSettle = () => {
  GetSocket().on('QuizGame:Settle', (data: IServerSettle) => {
    useClientStateStore.getState().setState(ClientState.VotingEnded);
    useGameStateStore.getState().setState(ServerGameState.Settle);
    useSettleStore.getState().setSettle({
      questionIndex: data.questionIndex,
      votes: [10, 20, 30, 40],
    });
  });
};