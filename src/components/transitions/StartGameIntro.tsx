import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

import { useSceneTransitionStore } from '../../stores/enterRoomTransitionStore';
import { TRANSITION_PRESETS } from '../../transitions/config';
import { useStagedTypingText } from '../../hooks/useStagedTypingText';
import { EmitStartGame } from '../../socket/events/room';

const {
  fadeInSec,
  fadeOutSec,
  typeCharMs,
  typePauseMs,
  typeHoldMs,
  typeFirst,
  typeSecond,
} = TRANSITION_PRESETS.startGameIntro;

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * StartGame 過場：變黑 → 打字 → 停 1s → emit → 等 GameStarted → 淡出
 * 是否啟用：TRANSITION_BY_STAGE.startGame = 'startGameIntro'
 */
const StartGameIntro = () => {
  const phase = useSceneTransitionStore((s) => s.phase);
  const transitionId = useSceneTransitionStore((s) => s.transitionId);
  const coverBeat = useSceneTransitionStore((s) => s.coverBeat);
  const markPerformanceDone = useSceneTransitionStore((s) => s.markPerformanceDone);

  const active = transitionId === 'startGameIntro' && phase !== 'idle';
  const typing = coverBeat === 'typing';
  const showText =
    coverBeat === 'typing' || coverBeat === 'holding' || phase === 'revealing';

  const stages = useMemo(
    () => [
      { text: typeFirst, charMs: typeCharMs, pauseAfterMs: typePauseMs },
      { text: typeSecond, charMs: typeCharMs, pauseAfterMs: typeHoldMs },
    ],
    [],
  );

  const onPerformanceDone = () => {
    const state = useSceneTransitionStore.getState();
    if (state.transitionId !== 'startGameIntro') return;
    if (state.phase !== 'covering' || state.coverBeat !== 'typing') return;
    EmitStartGame();
    markPerformanceDone();
  };

  const typed = useStagedTypingText(typing, stages, onPerformanceDone);
  const fullText = `${typeFirst}${typeSecond}`;
  const displayText =
    coverBeat === 'holding' || phase === 'revealing' ? fullText : typed;

  if (!active) return null;

  const covering = phase === 'covering';

  return (
    <div
      className='pointer-events-auto absolute inset-0 z-50 overflow-hidden'
      aria-hidden
    >
      <motion.div
        className='absolute inset-0 bg-black'
        initial={{ opacity: 0 }}
        animate={{ opacity: covering ? 1 : 0 }}
        transition={{
          duration: covering ? fadeInSec : fadeOutSec,
          ease: EASE,
        }}
      />

      {showText && (
        <div className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4'>
          <motion.div
            className='text-center text-4xl tracking-[0.15em] text-white/90'
            initial={{ opacity: 1 }}
            animate={{ opacity: covering ? 1 : 0 }}
            transition={{
              duration: fadeOutSec,
              ease: EASE,
            }}
          >
            {displayText}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StartGameIntro;
