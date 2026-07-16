import { create } from 'zustand';

import { GamePhase, IAnswerRevealData, IQuestionData, ISettleData } from '../types/game';

interface GameStore {
  phase: GamePhase,
  question: IQuestionData,
  settle: ISettleData | null,
  answerReveal: IAnswerRevealData | null,
  quizCount: number,
  setPhase: (phase: GamePhase) => void,
  setQuestion: (question: IQuestionData) => void,
  setSettle: (settle: ISettleData) => void,
  setAnswerReveal: (answerReveal: IAnswerRevealData) => void,
  setQuizCount: (quizCount: number) => void,
  resetRound: () => void,
}

const emptyQuestion: IQuestionData = {
  questionIndex: 0,
  question: '',
  options: [],
  votingTime: 0,
  totalQuestions: 0,
};

export const useGameStore = create<GameStore>((set) => ({
  phase: GamePhase.Idle,
  question: emptyQuestion,
  settle: null,
  answerReveal: null,
  quizCount: 0,
  setPhase: (phase: GamePhase) => set({ phase }),
  setQuestion: (question: IQuestionData) => set({
    question,
    phase: GamePhase.Voting,
    settle: null,
    answerReveal: null,
  }),
  setSettle: (settle: ISettleData) => set({ settle, phase: GamePhase.Settle }),
  setAnswerReveal: (answerReveal: IAnswerRevealData) => set({
    answerReveal,
    phase: GamePhase.ShowAnswer,
  }),
  setQuizCount: (quizCount: number) => set({ quizCount }),
  resetRound: () => set({
    phase: GamePhase.Idle,
    settle: null,
    answerReveal: null,
    question: emptyQuestion,
  }),
}));
