import React from 'react';

import { usePlayerCountStore } from '../stores/playerStore';

const PlayerCount = () => {
  const { count } = usePlayerCountStore();

  return (
    <div className='flex w-full items-center justify-center text-lg tracking-[0.35em] text-white/80'>
      目前參加人數：
      <span className='font-semibold tracking-normal text-white'>{count}</span>
    </div>
  );
};

export default PlayerCount;