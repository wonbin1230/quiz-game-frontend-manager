import React from 'react';

import { usePlayerCountStore } from '../stores/playerStore';

const PlayerCount = () => {
  const { count } = usePlayerCountStore();

  return (
    <div className='flex w-full items-center justify-center text-lg font-bold tracking-[0.35em] text-ink/80'>
      目前參加人數：
      <span className='font-bold tracking-normal text-gold'>{count}</span>
    </div>
  );
};

export default PlayerCount;