import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

/** 掛在 App 裡、喜帖外框之上，讓花朵不受卡片與外框的層級限制 */
export const ANSWER_ROSE_LAYER_ID = 'answer-rose-layer';

/** 花朵飄到正確選項中央再淡出的總時長（秒），下一題按鈕會等這段結束 */
export const ANSWER_ROSE_DURATION = 4;

const FLOWER_SRC = `${import.meta.env.BASE_URL}flower.png`;

/** public/flower.png 去背後的像素尺寸 */
const FLOWER_PIXEL_W = 892;
const FLOWER_PIXEL_H = 871;
/** 花心在圖中的比例，用來對準選項中央 */
const BLOOM_X = 0.5194;
const BLOOM_Y = 0.3879;

const FlowerVisual = ({ width, height }: { width: number, height: number }) => {
  const displayW = Math.min(width * 0.5, 300) * 0.75;
  const displayH = displayW * (FLOWER_PIXEL_H / FLOWER_PIXEL_W);
  const bloomX = displayW * BLOOM_X;
  const bloomY = displayH * BLOOM_Y;

  const startX = width * 0.18 - bloomX;
  const startY = height * 0.12 - bloomY;
  const endX = width / 2 - bloomX;
  const endY = height / 2 - bloomY;
  const midX = startX + (endX - startX) * 0.46;
  const midY = startY + (endY - startY) * 0.28;

  return (
    <motion.div
      className="absolute top-0 left-0"
      style={{ width: displayW, height: displayH, originX: BLOOM_X, originY: BLOOM_Y }}
      initial={{ opacity: 0, x: startX, y: startY, scale: 0.72, rotate: -8 }}
      animate={{
        opacity: [0, 1, 1, 1, 0],
        x: [startX, midX, endX, endX, endX],
        y: [startY, midY, endY, endY, endY],
        scale: [0.72, 1.02, 1.16, 1.22, 1.26],
        rotate: [-8, -3, 0, 0, 0],
      }}
      transition={{
        duration: ANSWER_ROSE_DURATION,
        times: [0, 0.16, 0.58, 0.74, 1],
        ease: 'easeInOut',
      }}
    >
      <div
        className="h-full w-full"
        style={{ filter: 'drop-shadow(0 12px 16px rgba(168, 90, 110, 0.38))' }}
      >
        <img
          src={FLOWER_SRC}
          alt=""
          draggable={false}
          className="answer-flower-wind pointer-events-none h-full w-full select-none"
        />
      </div>
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
            <FlowerVisual width={box.width} height={box.height} />
          </div>,
          layer,
        )
        : null}
    </>
  );
};

export default AnswerRose;
