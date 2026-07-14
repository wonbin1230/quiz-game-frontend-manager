import { create } from 'zustand';

import { IQuestionData } from '../types/question';

interface QuestionStore {
	question: IQuestionData,
	setQuestion: (question: IQuestionData) => void,
}

export const useQuestionStore = create<QuestionStore>((set) => ({
	question: {
		questionIndex: 0,
		question: '新郎和新娘的名字？',
		options: ['少于、芳瑀', '少宇、芳瑜', '少宇、芳瑀', '少雨、方瑀'],
	},
	setQuestion: (question: IQuestionData) => set(() => ({ question })),
}));
