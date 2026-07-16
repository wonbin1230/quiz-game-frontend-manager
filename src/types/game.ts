export enum GamePhase {
  Idle = 'Idle',
  Lobby = 'Lobby',
  Voting = 'Voting',
  Settle = 'Settle',
  ShowAnswer = 'ShowAnswer',
  Finished = 'Finished',
}

export interface IQuestionData {
  questionIndex: number,
  question: string,
  options: string[],
  votingTime: number,
  totalQuestions: number,
}

export interface ISettleData {
  questionIndex: number,
  votes: number[],
  totalVotes: number,
  correctAnswer: number,
}

export interface IAnswerRevealData {
  questionIndex: number,
  correctAnswer: number,
  totalAnswers: number,
}
