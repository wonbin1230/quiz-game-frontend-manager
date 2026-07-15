import React from 'react';

import { useClientStateStore } from '../stores/clientStateStore';
import { ClientState } from '../types/client-state';
import QuizContent from './QuizContent';
import Picture from './Picture';
import DanmakuOverlay from './DanmakuOverlay';

const MainContent = () => {
  const { state } = useClientStateStore();

  return (
    <>
      <div className='relative flex h-[calc(100vh-8rem)] items-center justify-center p-8!'>
        {state === ClientState.RoomCreated && <DanmakuOverlay />}
        <Picture src='/left.png' alt='left' />
        <Picture src='/right.png' alt='right' />
        <QuizContent />
      </div>
    </>
  );
};

export default MainContent;
