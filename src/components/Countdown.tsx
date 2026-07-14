import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Countdown = () => {
  const [second, setSecond] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecond((prev) => Math.max(prev - 1, -1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {second >= 0 && <div className='absolute inset-x-0 flex justify-center'>
        {second > 10 ? (
          <span className='text-9xl font-bold'>{second}</span>
        ) : (
          <AnimatePresence mode='wait'>
            <motion.span
              className='text-9xl font-bold text-red-600'
              key={second}
              initial={{ opacity: 0 }}
              animate={{ scale: [10, 1], opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {second}
            </motion.span>
          </AnimatePresence>
        )}
      </div>}
    </>
  );
};

export default Countdown;