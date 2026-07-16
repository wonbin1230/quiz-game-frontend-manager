import { ConnectToServer } from './client';
import { OnManagerLogin } from './events/login';
import { OnCreateRoom, OnUserJoin } from './events/room';
import { OnGameStarted, OnGetQuestion, OnSettle, OnAnswerReveal } from './events/game';

export const InitializeSocketSystem = () => {
  ConnectToServer();

  //! 在這裡可以添加其他的 Socket 事件監聽器或初始化邏輯
  // Room Events
  OnManagerLogin();
  OnCreateRoom();
  OnUserJoin();

  // Game Events
  OnGameStarted();
  OnGetQuestion();
  OnSettle();
  OnAnswerReveal();
};