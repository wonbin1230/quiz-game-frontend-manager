import { create } from 'zustand';

import { GamePhase, IQuestionData, ISettleData } from '../types/game';

interface GameStore {
  phase: GamePhase,
  question: IQuestionData,
  settle: ISettleData | null,
  quizCount: number,
  setPhase: (phase: GamePhase) => void,
  setQuestion: (question: IQuestionData) => void,
  setSettle: (settle: ISettleData) => void,
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
  quizCount: 0,
  setPhase: (phase: GamePhase) => set({ phase }),
  setQuestion: (question: IQuestionData) => set({ question, phase: GamePhase.Voting, settle: null }),
  setSettle: (settle: ISettleData) => set({ settle, phase: GamePhase.Settle }),
  setQuizCount: (quizCount: number) => set({ quizCount }),
  resetRound: () => set({ phase: GamePhase.Idle, settle: null, question: emptyQuestion }),
}));
