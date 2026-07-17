import React, { useEffect } from 'react';
import { InitializeSocketSystem } from './socket';

import { SessionState } from './types/session';
import { useSessionStore } from './stores/sessionStore';

import './App.css';
import QuizGame from './pages/QuizGame';
import LightRays from './components/backgrounds/LightRays';
import CreateRoomButton from './components/buttons/CreateRoomButton';
import CardCarousel from './components/carousel/CardCarousel';

/** 進房前輪播照片（public/w1.jpg ~ w8.jpg） */
const LOBBY_PHOTOS = [
  '/w1.jpg',
  '/w2.jpg',
  '/w3.jpg',
  '/w4.jpg',
  '/w5.jpg',
  '/w6.jpg',
  '/w7.jpg',
  '/w8.jpg',
];

const App = () => {
  const session = useSessionStore((s) => s.state);

  useEffect(() => {
    InitializeSocketSystem();
  }, []);

  return (
    <div className='relative min-h-screen overflow-hidden bg-black'>
      <div className='pointer-events-none absolute inset-0 z-0'>
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1}
          lightSpread={2}
          rayLength={3}
          followMouse={false}
          mouseInfluence={0}
          noiseAmount={0}
          distortion={0}
          className="custom-rays"
          fadeDistance={2}
          saturation={2}
        />
      </div>
      {session === SessionState.InRoom ? (
        <div className='relative z-10 p-4'>
          <QuizGame />
        </div>
      ) : (
        /* 外層與 InRoom（QuizGame → MainContent → QuizContent）完全相同，確保按鈕座標一致 */
        <div className='relative z-10 p-4'>
          <div className='relative flex min-h-screen flex-col'>
            <div className='relative flex h-screen items-center justify-center p-8!'>
              {/* 全寬幻燈片：垂直範圍避開與 PlayerList 相同的底部按鈕列 */}
              <div className='pointer-events-none absolute inset-x-0 top-8 bottom-[calc(2rem+1rem+0.5rem+3.5rem)]'>
                <CardCarousel images={LOBBY_PHOTOS} />
              </div>

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
      )}
    </div>
  );
};

export default App;
