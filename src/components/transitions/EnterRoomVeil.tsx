import React from 'react';
import { motion } from 'framer-motion';

import { useSceneTransitionStore } from '../../stores/enterRoomTransitionStore';
import { TRANSITION_PRESETS } from '../../transitions/config';

/**
 * 進房儀式遮罩 — 調色測試請改這裡
 * color: 蓋滿時的主色
 * glow: 中心柔光
 */
export const ENTER_ROOM_VEIL_COLORS = {
  color: '#faf3e4',
  glow: 'rgba(255, 236, 200, 0.95)',
} as const;

const ROMANTIC_EASE = [0.22, 1, 0.36, 1] as const;

const { durationSec, coverRatio } = TRANSITION_PRESETS.veil;
const coverSec = durationSec * coverRatio;
const revealSec = durationSec * (1 - coverRatio);

/**
 * Soft flash 蓋滿 →（中間切畫面）→ 左右白紗拉開揭開
 * 是否啟用：改 src/transitions/config.ts 的 TRANSITION_BY_STAGE.createRoom = 'veil'
 */
const EnterRoomVeil = () => {
  const phase = useSceneTransitionStore((s) => s.phase);
  const transitionId = useSceneTransitionStore((s) => s.transitionId);

  if (transitionId !== 'veil' || phase === 'idle') return null;

  const covering = phase === 'covering';

  return (
    <div
      className='pointer-events-auto absolute inset-0 z-50 overflow-hidden'
      style={
        {
          '--veil-color': ENTER_ROOM_VEIL_COLORS.color,
          '--veil-glow': ENTER_ROOM_VEIL_COLORS.glow,
        } as React.CSSProperties
      }
      aria-hidden
    >
      {covering && (
        <motion.div
          className='absolute inset-0'
          initial={{ opacity: 0, scale: 0.65 }}
          animate={{ opacity: 1, scale: 1.12 }}
          transition={{ duration: coverSec, ease: ROMANTIC_EASE }}
          style={{
            background:
              'radial-gradient(ellipse at 50% 42%, var(--veil-glow) 0%, var(--veil-color) 42%, var(--veil-color) 100%)',
          }}
        />
      )}

      {!covering && (
        <>
          <motion.div
            className='absolute inset-y-0 left-0 w-1/2'
            initial={{ x: '0%' }}
            animate={{ x: '-100%' }}
            transition={{ duration: revealSec, ease: ROMANTIC_EASE }}
            style={{ background: 'var(--veil-color)' }}
          />
          <motion.div
            className='absolute inset-y-0 right-0 w-1/2'
            initial={{ x: '0%' }}
            animate={{ x: '100%' }}
            transition={{ duration: revealSec, ease: ROMANTIC_EASE }}
            style={{ background: 'var(--veil-color)' }}
          />
          <motion.div
            className='pointer-events-none absolute inset-y-0 left-1/2 w-24 -translate-x-1/2'
            initial={{ opacity: 0.55, scaleX: 1 }}
            animate={{ opacity: 0, scaleX: 2.4 }}
            transition={{ duration: revealSec * 0.85, ease: ROMANTIC_EASE }}
            style={{
              background:
                'linear-gradient(90deg, transparent, var(--veil-glow), transparent)',
            }}
          />
        </>
      )}
    </div>
  );
};

export default EnterRoomVeil;
