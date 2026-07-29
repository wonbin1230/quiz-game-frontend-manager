import { create } from 'zustand';

import {
  GamePhase,
  IAnswerRevealData,
  IQuestionData,
  IRankingEntry,
  ISettleData,
} from '../types/game';

interface GameStore {
  phase: GamePhase,
  question: IQuestionData,
  settle: ISettleData | null,
  answerReveal: IAnswerRevealData | null,
  rankings: IRankingEntry[] | null,
  quizCount: number,
  setPhase: (phase: GamePhase) => void,
  setQuestion: (question: IQuestionData) => void,
  setSettle: (settle: ISettleData) => void,
  setAnswerReveal: (answerReveal: IAnswerRevealData) => void,
  setRankings: (rankings: IRankingEntry[]) => void,
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
  rankings: null,
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
  setRankings: (rankings: IRankingEntry[]) => set({
    rankings,
    phase: GamePhase.ShowRanking,
    settle: null,
    answerReveal: null,
  }),
  setQuizCount: (quizCount: number) => set({ quizCount }),
  resetRound: () => set({
    phase: GamePhase.Idle,
    settle: null,
    answerReveal: null,
    rankings: null,
    question: emptyQuestion,
  }),
}));
