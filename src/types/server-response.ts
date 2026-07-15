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
  correctAnswer: string,
  answers: IAnswerSummary[],
}