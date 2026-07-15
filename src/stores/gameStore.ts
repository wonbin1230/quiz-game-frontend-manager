import { create } from 'zustand';

import { IQuestionData, ISettleData } from '../types/game';

interface QuestionStore {
	question: IQuestionData,
	setQuestion: (question: IQuestionData) => void,
}

export const useQuestionStore = create<QuestionStore>((set) => ({
	question: {
		questionIndex: 0,
		question: '',
		options: [],
		votingTime: 0,
	},
	setQuestion: (question: IQuestionData) => set(() => ({ question })),
}));

interface SettleStore {
  settle: ISettleData,
  setSettle: (settle: ISettleData) => void,
}

export const useSettleStore = create<SettleStore>((set) => ({
  settle: {
    questionIndex: 0,
    votes: [],
  },
  setSettle: (settle: ISettleData) => set(() => ({ settle })),
}));