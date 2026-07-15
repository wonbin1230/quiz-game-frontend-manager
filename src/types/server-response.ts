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