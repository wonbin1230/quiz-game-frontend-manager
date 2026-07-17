import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useGameStore } from '../stores/gameStore';

const Countdown = () => {
  const votingTime = useGameStore((s) => s.question.votingTime);
  const [second, setSecond] = useState(-1);

  useEffect(() => {
    if (votingTime <= 0) return;

    setSecond(votingTime);

    const timer = setInterval(() => {
      setSecond((prev) => Math.max(prev - 1, -1));
    }, 1000);

    return () => clearInterval(timer);
  }, [votingTime]);

  if (second < 0) return null;

  return (
    <div className='pointer-events-none absolute inset-x-0 flex justify-center'>
      {second > 10 ? (
        <span className='text-7xl font-light tracking-[0.2em] text-white/50'>
          {second}
        </span>
      ) : (
        <AnimatePresence mode='wait'>
          <motion.span
            className='text-7xl font-light tracking-[0.2em] text-white'
            key={second}
            initial={{ opacity: 0 }}
            animate={{ scale: [2.4, 1], opacity: [0.35, 1] }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {second}
          </motion.span>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Countdown;
