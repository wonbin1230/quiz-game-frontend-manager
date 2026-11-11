import React from 'react';
import { motion } from 'framer-motion';

/** 蓋章動畫總時長（秒），供後續 UI 對齊出現時機 */
export const ANSWER_STAMP_DURATION = 2.3;

const WoodenStamp = () => (
  <svg
    viewBox="0 0 140 90"
    className="h-16 w-24 drop-shadow-lg"
    aria-hidden
  >
    {/* handle tip */}
    <ellipse cx="70" cy="8" rx="12" ry="5" fill="#6B3F1F" />
    {/* handle shaft */}
    <path
      d="M58 10 C56 22, 56 32, 60 42 L80 42 C84 32, 84 22, 82 10 Z"
      fill="url(#woodHandle)"
    />
    {/* wood rings on handle */}
    <ellipse cx="70" cy="18" rx="10" ry="3" fill="#5A3218" opacity="0.35" />
    <ellipse cx="70" cy="30" rx="10.5" ry="3.2" fill="#5A3218" opacity="0.3" />
    {/* stamp body (wide rectangle) */}
    <rect x="12" y="40" width="116" height="28" rx="5" fill="url(#woodBase)" />
    <rect x="18" y="45" width="104" height="18" rx="3" fill="#3E2412" opacity="0.22" />
    {/* stamp face (wide rectangle) */}
    <rect x="18" y="66" width="104" height="18" rx="3" fill="#4A2A14" />
    <rect x="24" y="68" width="92" height="12" rx="2" fill="#7A4A28" />
    <rect x="30" y="70" width="80" height="8" rx="1.5" fill="#C45C48" opacity="0.55" />
    <defs>
      <linearGradient id="woodHandle" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A66B3C" />
        <stop offset="45%" stopColor="#7A4524" />
        <stop offset="100%" stopColor="#5C3016" />
      </linearGradient>
      <linearGradient id="woodBase" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8B5530" />
        <stop offset="100%" stopColor="#5A3218" />
      </linearGradient>
    </defs>
  </svg>
);

const SealMark = () => (
  <div className="relative flex h-9 w-[4.25rem] items-center justify-center">
    <div
      className="absolute inset-0 rounded-[3px] border-[3px] border-red-500"
      style={{
        boxShadow:
          'inset 0 0 0 1px rgba(248, 113, 113, 0.5), 0 0 10px rgba(239, 68, 68, 0.55)',
      }}
    />
    <div className="absolute inset-[5px] rounded-[1px] border border-red-400/80" />
    <span
      className="relative whitespace-nowrap text-[15px] font-black leading-none tracking-[0.12em] text-red-400"
      style={{
        fontFamily: '"Noto Serif TC", "Songti TC", "SimSun", serif',
        textShadow: '0 0 8px rgba(248, 113, 113, 0.65)',
      }}
    >
      正確
    </span>
  </div>
);

interface IAnswerStampProps {
  active: boolean,
}

const AnswerStamp = ({ active }: IAnswerStampProps) => {
  if (!active) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
      <div className="absolute right-2 top-2">
        {/* wooden stamp */}
        <motion.div
          className="absolute left-1/2 top-0"
          initial={{ opacity: 0, x: '-50%', y: -72, scale: 1.08, rotate: -18 }}
          animate={{
            opacity: [0, 1, 1, 1, 0],
            x: '-50%',
            y: [-88, -70, -70, -38, -96],
            scale: [1.08, 0.95, 0.95, 0.86, 1],
            rotate: [-18, -14, -14, -10, -16],
          }}
          transition={{
            // 出現 → 停留約 1 秒 → 蓋下 → 抬起
            duration: ANSWER_STAMP_DURATION,
            times: [0, 0.13, 0.57, 0.7, 1],
            ease: ['easeOut', 'linear', 'easeIn', 'easeOut'],
          }}
        >
          <WoodenStamp />
        </motion.div>

        {/* seal imprint */}
        <motion.div
          initial={{ opacity: 0, scale: 1.35, rotate: -18 }}
          animate={{
            opacity: [0, 0, 0, 0.94, 1],
            scale: [1.35, 1.35, 1.35, 0.92, 1],
            rotate: [-18, -18, -18, -10, -12],
          }}
          transition={{
            duration: ANSWER_STAMP_DURATION,
            times: [0, 0.13, 0.57, 0.72, 1],
            ease: 'easeOut',
          }}
        >
          <SealMark />
        </motion.div>
      </div>
    </div>
  );
};

export default AnswerStamp;
