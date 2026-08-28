export enum ServerRoomState {
  Prepare = 'Prepare',
  InGame = 'InGame',
  Finished = 'Finished',
}

export enum ServerGameState {
  Prepare = 'Prepare',
  StartGame = 'StartGame',
  Voting = 'Voting',
  Settle = 'Settle',
  ShowAnswer = 'ShowAnswer',
  ShowRanking = 'ShowRanking',
  Waiting = 'Waiting',
  Finished = 'Finished',
}

export interface IServerManagerLogin {
  managerId: string,
}

export interface IServerCreateRoom {
  roomId: string,
}

export interface IServerUserJoined {
  userId: string,
  userList: string[],
  userCount: number,
  disconnectedUserIds: string[],
}

export interface IServerUserLeft {
  userId: string,
  userList: string[],
  userCount: number,
  disconnectedUserIds: string[],
}

export interface IServerStartGame {
  roomId: string,
  quizCount: number,
}

export interface IServerGetQuestion {
  roomId: string,
  question: string,
  options: string[],
  questionIndex: number,
  totalQuestions: number,
  votingTime: number,
}

interface IAnswerSummary {
  userId: string,
  optionIndex: number,
  isCorrect: boolean,
}

export interface IServerSettle {
  roomId: string,
  questionIndex: number,
  correctAnswer: number,
  answers: IAnswerSummary[],
}

export interface IServerAnswerReveal {
  roomId: string,
  questionIndex: number,
  correctAnswer: number,
  totalAnswers: number,
}

export interface IServerRankingEntry {
  userId: string,
  rank: number,
  correctCount: number,
  totalTime: number,
}

export interface IServerShowRanking {
  roomId: string,
  rankings: IServerRankingEntry[],
}

export interface IServerFinishGame {
  roomId: string,
  roomState: ServerRoomState,
  gameState: ServerGameState,
}