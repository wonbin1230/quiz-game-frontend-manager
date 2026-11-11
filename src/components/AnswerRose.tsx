import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

/** 掛在 App 裡、喜帖外框之上，讓玫瑰不受卡片與外框的層級限制 */
export const ANSWER_ROSE_LAYER_ID = 'answer-rose-layer';

/** 玫瑰飄到正確選項中央再淡出的總時長（秒），下一題按鈕會等這段結束 */
export const ANSWER_ROSE_DURATION = 4;

const Rose = () => (
  <svg viewBox="0 0 64 96" className="h-32 w-20 drop-shadow-md" aria-hidden>
    <path
      d="M32 50 C34 64, 29 78, 33 92"
      fill="none"
      stroke="#6d8a62"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <ellipse cx="22" cy="70" rx="11" ry="5" transform="rotate(-42 22 70)" fill="#8eae7c" />
    <ellipse cx="44" cy="62" rx="10" ry="4.6" transform="rotate(36 44 62)" fill="#75986a" />
    <ellipse cx="32" cy="30" rx="17" ry="15" fill="#e7a8b2" />
    <ellipse cx="20" cy="32" rx="11" ry="13" transform="rotate(-18 20 32)" fill="#d47886" />
    <ellipse cx="44" cy="32" rx="11" ry="13" transform="rotate(18 44 32)" fill="#c45c6a" />
    <ellipse cx="32" cy="26" rx="10" ry="11" fill="#f3d0d6" />
    <ellipse cx="32" cy="28" rx="5.5" ry="6.5" fill="#a84d5c" />
    <circle cx="32" cy="28" r="2.2" fill="#f6ebe8" />
  </svg>
);

/** 花朵在圖裡的中心，用來對齊卡片左上角與正中央 */
const BLOOM_X = 40;
const BLOOM_Y = 40;

const RoseVisual = ({ width, height }: { width: number, height: number }) => {
  const startX = 36 - BLOOM_X;
  const startY = 36 - BLOOM_Y;
  const endX = width / 2 - BLOOM_X;
  const endY = height / 2 - BLOOM_Y;
  const midX = startX + (endX - startX) * 0.46;
  const midY = startY + (endY - startY) * 0.3;

  return (
    <motion.div
      className="absolute top-0 left-0 h-32 w-20"
      style={{ originX: 0.5, originY: 40 / 128, filter: 'drop-shadow(0 10px 14px rgba(168,77,92,0.45))' }}
      initial={{ opacity: 0, x: startX, y: startY, scale: 0.7, rotate: -18 }}
      animate={{
        opacity: [0, 1, 1, 1, 0],
        x: [startX, midX, endX, endX, endX],
        y: [startY, midY, endY, endY, endY],
        scale: [0.7, 1.05, 1.4, 1.55, 1.6],
        rotate: [-18, -8, 0, 2, 3],
      }}
      transition={{
        duration: ANSWER_ROSE_DURATION,
        times: [0, 0.16, 0.58, 0.74, 1],
        ease: 'easeInOut',
      }}
    >
      <Rose />
    </motion.div>
  );
};

interface IAnswerRoseProps {
  active: boolean,
}

const AnswerRose = ({ active }: IAnswerRoseProps) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ top: number, left: number, width: number, height: number } | null>(null);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const layer = document.getElementById(ANSWER_ROSE_LAYER_ID);
    if (!active || !anchor || !layer) {
      setBox(null);
      return;
    }

    const update = () => {
      const anchorRect = anchor.getBoundingClientRect();
      const layerRect = layer.getBoundingClientRect();
      setBox((prev) => {
        const next = {
          top: anchorRect.top - layerRect.top,
          left: anchorRect.left - layerRect.left,
          width: anchorRect.width,
          height: anchorRect.height,
        };
        if (
          prev
          && prev.top === next.top
          && prev.left === next.left
          && prev.width === next.width
          && prev.height === next.height
        ) {
          return prev;
        }
        return next;
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(anchor);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [active]);

  const layer = document.getElementById(ANSWER_ROSE_LAYER_ID);

  return (
    <>
      <div ref={anchorRef} className="pointer-events-none absolute inset-0" aria-hidden />
      {active && box && layer
        ? createPortal(
          <div
            className="pointer-events-none absolute overflow-visible"
            style={{ top: box.top, left: box.left, width: box.width, height: box.height }}
          >
            <RoseVisual width={box.width} height={box.height} />
          </div>,
          layer,
        )
        : null}
    </>
  );
};

export default AnswerRose;
