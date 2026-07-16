import React from 'react';
import { motion } from 'framer-motion';

const WoodenStamp = () => (
  <svg
    viewBox="0 0 140 90"
    className="h-20 w-32 drop-shadow-lg"
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
  <div className="relative flex h-14 w-44 items-center justify-center px-2">
    <div
      className="absolute inset-0 rounded-md border-[4px] border-red-700/90"
      style={{
        boxShadow: 'inset 0 0 0 2px rgba(185, 28, 28, 0.35)',
      }}
    />
    <div className="absolute inset-1.5 rounded-sm border-2 border-red-600/50" />
    <span
      className="relative whitespace-nowrap text-2xl font-black tracking-[0.2em] text-red-700"
      style={{
        fontFamily: '"Noto Serif TC", "Songti TC", "SimSun", serif',
        textShadow: '0 1px 0 rgba(127, 29, 29, 0.35)',
      }}
    >
      正確答案
    </span>
  </div>
);

interface IAnswerStampProps {
  active: boolean,
}

const AnswerStamp = ({ active }: IAnswerStampProps) => {
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
      {/* wooden stamp */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[70%]"
        initial={{ opacity: 0, y: -56, scale: 1.15, rotate: -12 }}
        animate={{
          opacity: [0, 1, 1, 1, 0],
          y: [-56, -28, -28, 8, -72],
          scale: [1.15, 1, 1, 0.92, 1.05],
          rotate: [-12, -8, -8, -2, -10],
        }}
        transition={{
          // 出現 → 停留約 1 秒 → 蓋下 → 抬起
          duration: 2.3,
          times: [0, 0.13, 0.57, 0.7, 1],
          ease: ['easeOut', 'linear', 'easeIn', 'easeOut'],
        }}
      >
        <WoodenStamp />
      </motion.div>

      {/* seal imprint */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 1.35, rotate: -8 }}
        animate={{
          opacity: [0, 0, 0, 0.88, 0.92],
          scale: [1.35, 1.35, 1.35, 0.94, 1],
          rotate: [-8, -8, -8, -4, -5],
        }}
        transition={{
          duration: 2.3,
          times: [0, 0.13, 0.57, 0.72, 1],
          ease: 'easeOut',
        }}
      >
        <SealMark />
      </motion.div>
    </div>
  );
};

export default AnswerStamp;
