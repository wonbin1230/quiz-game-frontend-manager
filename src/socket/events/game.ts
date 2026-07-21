import { GetSocket } from '../client';

import {
  IServerStartGame,
  IServerGetQuestion,
  IServerSettle,
  IServerAnswerReveal,
} from '../../types/server-response';
import { GamePhase } from '../../types/game';
import { useGameStore } from '../../stores/gameStore';
import { useSceneTransitionStore } from '../../stores/enterRoomTransitionStore';

const aggregateVotes = (optionCount: number, answers: { optionIndex: number }[]) => {
  const votes = Array.from({ length: optionCount }, () => 0);

  for (const answer of answers) {
    if (answer.optionIndex >= 0 && answer.optionIndex < optionCount) {
      votes[answer.optionIndex] += 1;
    }
  }

  return votes;
};

export const OnGameStarted = () => {
  GetSocket().on('QuizGame:GameStarted', (data: IServerStartGame) => {
    useGameStore.getState().setQuizCount(data.quizCount);
    useGameStore.getState().setPhase(GamePhase.Lobby);
  });
};

export const OnGetQuestion = () => {
  GetSocket().on('QuizGame:Question', (data: IServerGetQuestion) => {
    useGameStore.getState().setQuestion({
      questionIndex: data.questionIndex,
      question: data.question,
      options: data.options,
      votingTime: data.votingTime,
      totalQuestions: data.totalQuestions,
    });
    useSceneTransitionStore.getState().notifyGameStarted();
  });
};

export const OnSettle = () => {
  GetSocket().on('QuizGame:Settle', (data: IServerSettle) => {
    const { question } = useGameStore.getState();
    const votes = aggregateVotes(question.options.length, data.answers);

    useGameStore.getState().setSettle({
      questionIndex: data.questionIndex,
      votes,
      totalVotes: data.answers.length,
      correctAnswer: data.correctAnswer,
    });
  });
};

export const OnAnswerReveal = () => {
  GetSocket().on('QuizGame:AnswerReveal', (data: IServerAnswerReveal) => {
    useGameStore.getState().setAnswerReveal({
      questionIndex: data.questionIndex,
      correctAnswer: data.correctAnswer,
      totalAnswers: data.totalAnswers,
    });
  });
};
