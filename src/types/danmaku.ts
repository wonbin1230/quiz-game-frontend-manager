export enum DanmakuSystemType {
  PlayerJoin = 'PlayerJoin',
  PlayerLeave = 'PlayerLeave',
  WishingContent = 'WishingContent',
}

export interface IDanmakuContent {
  sender: string,
  systemType: DanmakuSystemType,
  content: string,
  bonusContent: string,
}