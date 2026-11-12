import React, { useEffect } from 'react';
import { InitializeSocketSystem } from './socket';

import { SessionState } from './types/session';
import { useSessionStore } from './stores/sessionStore';
import { useSceneTransitionStore } from './stores/enterRoomTransitionStore';

import './App.css';
import QuizGame from './pages/QuizGame';
import CreateRoomButton from './components/buttons/CreateRoomButton';
import CardCarousel from './components/carousel/CardCarousel';
import EnterRoomVeil from './components/transitions/EnterRoomVeil';
import EnterRoomRevealImage from './components/transitions/EnterRoomRevealImage';
import { ANSWER_ROSE_LAYER_ID } from './components/AnswerRose';
import { DANMAKU_LAYER_ID } from './components/DanmakuOverlay';
import StartGameIntro from './components/transitions/StartGameIntro';

const BACKGROUND_URL = `${import.meta.env.BASE_URL}background.png`;

/** 進房前輪播照片（public/w1.jpg ~ w8.jpg） */
const LOBBY_PHOTOS = [
  `${import.meta.env.BASE_URL}w1.jpg`,
  `${import.meta.env.BASE_URL}w2.jpg`,
  `${import.meta.env.BASE_URL}w3.jpg`,
  `${import.meta.env.BASE_URL}w4.jpg`,
  `${import.meta.env.BASE_URL}w5.jpg`,
  `${import.meta.env.BASE_URL}w6.jpg`,
  `${import.meta.env.BASE_URL}w7.jpg`,
  `${import.meta.env.BASE_URL}w8.jpg`,
];

const App = () => {
  const session = useSessionStore((s) => s.state);
  const phase = useSceneTransitionStore((s) => s.phase);
  const stage = useSceneTransitionStore((s) => s.stage);
  const transitionId = useSceneTransitionStore((s) => s.transitionId);
  const coverBeat = useSceneTransitionStore((s) => s.coverBeat);

  const inRoom = session === SessionState.InRoom;
  // 僅 createRoom covering 仍顯示 lobby；startGame covering 維持房間畫面
  const createRoomCovering = phase === 'covering' && stage === 'createRoom';
  const showLobby = !inRoom || createRoomCovering;
  const showRoom = inRoom && !createRoomCovering;

  const shrinking =
    transitionId === 'carouselExit' && coverBeat === 'shrink';
  const showCarousel =
    transitionId !== 'carouselExit' || coverBeat === 'shrink' || coverBeat === 'none';

  useEffect(() => {
    InitializeSocketSystem();
  }, []);

  return (
    <div className='relative min-h-screen overflow-hidden bg-paper text-ink'>
      <div
        className='pointer-events-none absolute inset-0 z-0'
        aria-hidden
        style={{
          backgroundImage: `url(${BACKGROUND_URL})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div id={ANSWER_ROSE_LAYER_ID} className="pointer-events-none absolute inset-0 z-30 overflow-visible" />
      <div id={DANMAKU_LAYER_ID as string} className="pointer-events-none absolute inset-0 z-[35] overflow-visible" />

      {showRoom ? (
        <div className='relative z-10 p-4'>
          <QuizGame />
        </div>
      ) : showLobby ? (
        /* 外層與 InRoom（QuizGame → MainContent → QuizContent）完全相同，確保按鈕座標一致 */
        <div className='relative z-10 p-4'>
          <div className='relative flex min-h-screen flex-col'>
            <div className='relative flex h-screen items-center justify-center p-8!'>
              {showCarousel && (
                <div className='pointer-events-none absolute inset-x-0 top-8 bottom-[calc(2rem+1rem+0.5rem+3.5rem)]'>
                  <CardCarousel
                    images={LOBBY_PHOTOS}
                    exitMode={shrinking ? 'shrink' : 'none'}
                  />
                </div>
              )}

              <div className='relative flex h-full min-h-0 w-[70%] flex-col gap-2 overflow-hidden p-4'>
                <div className='flex h-full min-h-0 flex-col gap-2'>
                  <div className='min-h-0 flex-1' aria-hidden />
                  <div className='flex shrink-0 flex-col gap-2'>
                    <div className='flex h-14 shrink-0 items-center justify-center'>
                      <CreateRoomButton />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <EnterRoomRevealImage />
      {/* 面紗元件保留；僅在 TRANSITION_BY_STAGE 選 veil 時會顯示 */}
      <EnterRoomVeil />
      <StartGameIntro />
    </div>
  );
};

export default App;
