export enum DanmakuSystemType {
  PlayerJoin = 'PlayerJoin',
  WishingContent = 'WishingContent',
}

export interface IDanmakuContent {
  sender: string,
  systemType: DanmakuSystemType,
  content: string,
  bonusContent: string,
}