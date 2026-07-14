export enum RoomState {
  Prepare = 'Prepare',
  InGame = 'InGame',
  Finished = 'Finished',
}

export interface IRoom {
  roomId: string,
  roomName: string,
  roomState: RoomState,
}