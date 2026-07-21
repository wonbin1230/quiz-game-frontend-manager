import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { TRANSITION_PRESETS } from '../../transitions/config';
import './CardCarousel.css';

export type CarouselExitMode = 'none' | 'shrink';

/** 卡片長寬比 寬:高 = 3:4 */
const CARD_ASPECT = 3 / 4;

/** 須與 CSS perspective 一致 */
const PERSPECTIVE_PX = 1600;

/** 貼齊容器邊緣的安全係數，避免透視誤差導致裁切／蓋住按鈕 */
const FIT_INSET = 0.98;

interface ICardCarouselProps {
  images: string[],
  /** 一圈旋轉秒數，預設 40 */
  durationSec?: number,
  /** 縮小退場：scale 1→0.1 與旋轉加速同一時間軸 */
  exitMode?: CarouselExitMode,
  /** 卡片寬 = 視窗寬 × 此比例（目標值；塞不下會等比縮小），預設 0.25 */
  cardSizeRatio?: number,
  /** 相鄰卡片空隙 = 卡片寬 × 此比例，預設 0.15 */
  gapRatio?: number,
}

function getDesiredCardWidthPx(cardSizeRatio: number) {
  if (typeof window === 'undefined') return 520;
  return window.innerWidth * cardSizeRatio;
}

/** 空隙 = 卡片寬 × gapRatio → 半徑使相鄰卡片中心弦長 = 卡片寬 + 空隙 */
function getRadiusPx(cardWidth: number, count: number, gapRatio: number) {
  if (count <= 1) return 0;
  return (cardWidth * (1 + gapRatio)) / (2 * Math.sin(Math.PI / count));
}

/**
 * 估算整圈在透視下的半寬（取各卡片左右邊投影 |x| 最大值）。
 * 對整圈旋轉採樣，涵蓋動畫過程中的最寬狀態。
 */
function getProjectedHalfWidth(cardWidth: number, radius: number, count: number) {
  if (count <= 1) {
    const denom = PERSPECTIVE_PX - radius;
    if (denom <= 1) return Infinity;
    return (cardWidth / 2) * (PERSPECTIVE_PX / denom);
  }

  let maxX = 0;
  const step = (2 * Math.PI) / count;
  const phaseSamples = 12;

  for (let s = 0; s < phaseSamples; s++) {
    const phase = (step * s) / phaseSamples;
    for (let i = 0; i < count; i++) {
      const theta = step * i + phase;
      const cx = radius * Math.sin(theta);
      const cz = radius * Math.cos(theta);
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);

      for (const side of [-0.5, 0.5] as const) {
        const lx = side * cardWidth;
        const wx = cx + lx * cos;
        const wz = cz - lx * sin;
        const denom = PERSPECTIVE_PX - wz;
        if (denom <= 1) return Infinity;
        maxX = Math.max(maxX, Math.abs(wx * (PERSPECTIVE_PX / denom)));
      }
    }
  }

  return maxX;
}

/** 正面卡（z 最大）透視後的半高 */
function getProjectedHalfHeight(cardHeight: number, radius: number) {
  const denom = PERSPECTIVE_PX - radius;
  if (denom <= 1) return Infinity;
  return (cardHeight / 2) * (PERSPECTIVE_PX / denom);
}

function fitsInContainer(
  cardWidth: number,
  count: number,
  gapRatio: number,
  containerW: number,
  containerH: number,
) {
  const radius = getRadiusPx(cardWidth, count, gapRatio);
  if (radius >= PERSPECTIVE_PX - 40) return false;

  const cardHeight = cardWidth / CARD_ASPECT;
  const halfW = getProjectedHalfWidth(cardWidth, radius, count);
  const halfH = getProjectedHalfHeight(cardHeight, radius);

  return halfW * 2 <= containerW && halfH * 2 <= containerH;
}

/** 目標寬塞不下時，二分找出維持比例且完整可見的最大卡片寬 */
function fitCardWidth(
  desired: number,
  count: number,
  gapRatio: number,
  containerW: number,
  containerH: number,
) {
  const availW = containerW * FIT_INSET;
  const availH = containerH * FIT_INSET;
  if (availW <= 0 || availH <= 0) return desired;

  if (fitsInContainer(desired, count, gapRatio, availW, availH)) {
    return desired;
  }

  let lo = 0;
  let hi = desired;
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    if (fitsInContainer(mid, count, gapRatio, availW, availH)) lo = mid;
    else hi = mid;
  }
  return lo;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const CardCarousel = ({
  images,
  durationSec = 40,
  exitMode = 'none',
  cardSizeRatio = 0.25,
  gapRatio = 0.15,
}: ICardCarouselProps) => {
  const count = images.length;
  const [cardWidth, setCardWidth] = useState(() => getDesiredCardWidthPx(cardSizeRatio));
  const wrapRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const sync = () => {
      const { clientWidth, clientHeight } = wrap;
      const desired = getDesiredCardWidthPx(cardSizeRatio);
      setCardWidth(
        fitCardWidth(desired, count, gapRatio, clientWidth, clientHeight),
      );
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(wrap);
    window.addEventListener('resize', sync);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [cardSizeRatio, gapRatio, count]);

  // scale 與 playbackRate 綁同一進度，邊縮邊加速（不改 animation-duration）
  useEffect(() => {
    const wrap = wrapRef.current;
    const root = rootRef.current;
    if (!wrap || !root) return;

    const reset = () => {
      wrap.style.transform = '';
      root.getAnimations().forEach((anim) => {
        anim.playbackRate = 1;
      });
    };

    if (exitMode !== 'shrink') {
      reset();
      return;
    }

    const shrinkSec = TRANSITION_PRESETS.carouselExit.shrinkSec;
    // 目標：一圈從 durationSec 秒 → 約 0.35 秒
    const endRate = durationSec / 0.35;

    let raf = 0;
    const t0 = performance.now();

    const frame = (now: number) => {
      const rawT = Math.min(1, (now - t0) / (shrinkSec * 1000));
      const easedT = easeOutCubic(rawT);

      wrap.style.transform = `scale(${lerp(1, 0.1, easedT)})`;

      const rate = lerp(1, endRate, rawT * rawT);
      root.getAnimations().forEach((anim) => {
        anim.playbackRate = rate;
      });

      if (rawT < 1) {
        raf = requestAnimationFrame(frame);
      }
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      reset();
    };
  }, [exitMode, durationSec]);

  if (count === 0) return null;

  const cardHeight = cardWidth / CARD_ASPECT;
  const angleStep = 360 / count;
  const delayStep = durationSec / count;
  const radius = getRadiusPx(cardWidth, count, gapRatio);

  return (
    <div ref={wrapRef} className='card-carousel-shrink-wrap'>
      <div
        ref={rootRef}
        className='card-carousel'
        style={
          {
            '--card-w': `${cardWidth}px`,
            '--card-h': `${cardHeight}px`,
            '--carousel-duration': `${durationSec}s`,
            animationDuration: count === 1 ? undefined : `${durationSec}s`,
            animationName: count === 1 ? 'none' : undefined,
          } as React.CSSProperties
        }
      >
        {images.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className='card-carousel__card'
            style={{
              transform: `translate(-50%, -50%) rotateY(${angleStep * index}deg) translateZ(${radius}px)`,
              animationDelay: `-${delayStep * index}s`,
              animationDuration: `${durationSec}s`,
              animationName: count === 1 ? 'none' : undefined,
              filter: count === 1 ? 'brightness(1)' : undefined,
            }}
          >
            <img src={src} alt='' draggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardCarousel;
