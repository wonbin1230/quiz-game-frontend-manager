import React from 'react';

/** 喜帖式邊框：只裝飾螢幕邊緣，不攔截點擊 */
const InviteFrame = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden>
      <div className="absolute inset-3 rounded-[28px] border-2 border-blush/80 shadow-[inset_0_0_0_6px_rgba(251,246,239,0.72),inset_0_0_0_8px_rgba(203,182,220,0.55)]" />

      <svg className="absolute left-5 top-4 h-16 w-24 text-gold/80" viewBox="0 0 96 64">
        <path fill="currentColor" d="M28 6a12 12 0 1 0 0 20 9 9 0 1 1 0-20z" />
        <path fill="#e7b4be" d="M70 14l1.2 3.4h3.6l-2.9 2.1 1.1 3.4-3-2.2-3 2.2 1.1-3.4-2.9-2.1h3.6z" />
        <circle cx="52" cy="10" r="1.4" fill="#cbb6dc" />
        <circle cx="84" cy="28" r="1.1" fill="#b08a58" />
      </svg>

      <svg className="absolute right-5 top-4 h-16 w-24 text-lilac" viewBox="0 0 96 64">
        <path fill="#e7b4be" d="M22 16l1.3 3.6h3.8l-3 2.2 1.2 3.6-3.3-2.4-3.3 2.4 1.2-3.6-3-2.2h3.8z" />
        <circle cx="48" cy="12" r="1.3" fill="#b08a58" />
        <circle cx="70" cy="22" r="1.6" fill="#cbb6dc" />
        <circle cx="84" cy="14" r="1" fill="#e7b4be" />
      </svg>

      <svg className="absolute bottom-4 left-6 h-12 w-20 text-blush" viewBox="0 0 80 48">
        <circle cx="14" cy="30" r="1.3" fill="#cbb6dc" />
        <path fill="currentColor" d="M40 28l1.1 3.1h3.3l-2.7 2 1 3.2-2.7-2-2.7 2 1-3.2-2.7-2h3.3z" />
        <circle cx="64" cy="34" r="1.2" fill="#b08a58" />
      </svg>

      <svg className="absolute right-6 bottom-4 h-12 w-20 text-gold/80" viewBox="0 0 80 48">
        <path fill="#cbb6dc" d="M18 30l1 2.8h3l-2.4 1.8.9 2.8-2.5-1.8-2.5 1.8.9-2.8-2.4-1.8h3z" />
        <circle cx="46" cy="34" r="1.3" fill="#e7b4be" />
        <circle cx="66" cy="28" r="1.1" fill="#b08a58" />
      </svg>
    </div>
  );
};

export default InviteFrame;
