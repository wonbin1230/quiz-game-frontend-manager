import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { useSceneTransitionStore } from '../../stores/enterRoomTransitionStore';
import { TRANSITION_PRESETS } from '../../transitions/config';

const { revealImageSec } = TRANSITION_PRESETS.carouselExit;

/** scale=1 時的顯示上限（需與下方 className 一致） */
const BASE_MAX_WIDTH_PX = 520;
const BASE_WIDTH_VW = 0.6;
const BASE_MAX_HEIGHT_VH = 0.7;

/**
 * 以 scale=1 的 contain 顯示尺寸為基準，
 * 算出要 cover 全螢幕所需的 scale（取較大邊，會裁切）。
 */
function getCoverScale(naturalWidth: number, naturalHeight: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxW = Math.min(vw * BASE_WIDTH_VW, BASE_MAX_WIDTH_PX);
  const maxH = vh * BASE_MAX_HEIGHT_VH;

  const fit = Math.min(maxW / naturalWidth, maxH / naturalHeight);
  const displayW = naturalWidth * fit;
  const displayH = naturalHeight * fit;

  return Math.max(vw / displayW, vh / displayH);
}

/**
 * 輪播縮到 0.1 後接棒：揭幕圖由 0.1 → 依螢幕放大蓋滿（cover）
 * 圖檔路徑可換；目前：public/yuyu.png
 */
const EnterRoomRevealImage = () => {
  const transitionId = useSceneTransitionStore((s) => s.transitionId);
  const coverBeat = useSceneTransitionStore((s) => s.coverBeat);
  const imgRef = useRef<HTMLImageElement>(null);
  const [coverScale, setCoverScale] = useState<number | null>(null);

  const active = transitionId === 'carouselExit' && coverBeat === 'revealImage';

  useLayoutEffect(() => {
    if (!active) {
      setCoverScale(null);
      return;
    }

    const img = imgRef.current;
    if (!img) return;

    const update = () => {
      if (img.naturalWidth <= 0 || img.naturalHeight <= 0) return;
      setCoverScale(getCoverScale(img.naturalWidth, img.naturalHeight));
    };

    if (img.complete) {
      update();
    } else {
      img.addEventListener('load', update);
    }

    window.addEventListener('resize', update);
    return () => {
      img.removeEventListener('load', update);
      window.removeEventListener('resize', update);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      className='pointer-events-none absolute inset-0 z-40 flex items-center justify-center'
      aria-hidden
    >
      <motion.img
        ref={imgRef}
        src='/yuyu.png'
        alt=''
        draggable={false}
        className='max-h-[70vh] w-[min(60vw,520px)] object-contain'
        initial={{ scale: 0.1 }}
        animate={{ scale: coverScale ?? 0.1 }}
        transition={{
          duration: coverScale === null ? 0 : revealImageSec,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </div>
  );
};

export default EnterRoomRevealImage;
