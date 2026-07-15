export interface IQuestionData {
  questionIndex: number,
  question: string,
  options: string[],
  votingTime: number,
}

export interface ISettleData {
  questionIndex: number,
  votes: number[],
}