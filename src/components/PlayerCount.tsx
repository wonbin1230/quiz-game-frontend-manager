import React from 'react';

import { usePlayerCountStore } from '../stores/playerStore';

const PlayerCount = () => {
  const { count } = usePlayerCountStore();

  return (
    <div className='flex items-center justify-center w-full text-6xl'>
      目前參加人數：{count}
    </div>
  );
};

export default PlayerCount;