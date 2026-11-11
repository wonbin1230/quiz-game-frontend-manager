import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

import {
  formatDanmakuText,
  LANE_COUNT,
  setDanmakuTrackMetrics,
  useDanmakuStore,
} from '../stores/danmakuStore';

const LANES = Array.from({ length: LANE_COUNT }, (_, lane) => lane);

/** 掛在喜帖外框之上，彈幕才不會被邊框蓋住 */
export const DANMAKU_LAYER_ID = 'danmaku-layer';

const DanmakuOverlay = () => {
  const { items, removeItem, clear } = useDanmakuStore();
  const trackRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState<{ top: number, left: number, width: number, height: number } | null>(null);

  useLayoutEffect(() => {
    const measure = (text: string) => {
      const probe = probeRef.current;
      if (!probe) return 0;
      probe.textContent = text;
      const width = probe.offsetWidth;
      probe.textContent = '';
      return width;
    };

    const publish = () => {
      const track = trackRef.current;
      const layer = document.getElementById(DANMAKU_LAYER_ID);
      if (!track) return;
      setDanmakuTrackMetrics({
        viewportWidth: window.innerWidth,
        offsetLeft: track.getBoundingClientRect().left,
        measure,
      });
      if (!layer) return;
      const trackRect = track.getBoundingClientRect();
      const layerRect = layer.getBoundingClientRect();
      setBox((prev) => {
        const next = {
          top: trackRect.top - layerRect.top,
          left: trackRect.left - layerRect.left,
          width: trackRect.width,
          height: trackRect.height,
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

    publish();
    window.addEventListener('resize', publish);
    const observer = new ResizeObserver(publish);
    if (trackRef.current) observer.observe(trackRef.current);

    return () => {
      window.removeEventListener('resize', publish);
      observer.disconnect();
      setDanmakuTrackMetrics(null);
    };
  }, []);

  useEffect(() => {
    return () => clear();
  }, [clear]);

  const layer = document.getElementById(DANMAKU_LAYER_ID);

  const lanes = LANES.map((lane) => (
    <div key={lane} className="relative min-h-0 flex-1 overflow-visible">
      {items
        .filter((item) => item.lane === lane)
        .map((item) => (
          <div
            key={item.id}
            className="absolute top-1/2 left-0 -translate-y-1/2"
          >
            <motion.div
              className="whitespace-nowrap text-lg font-bold tracking-[0.2em] text-ink/75"
              initial={{ x: item.fromX }}
              animate={{ x: item.toX }}
              transition={{ duration: item.duration, ease: 'linear' }}
              onAnimationComplete={() => removeItem(item.id)}
            >
              {formatDanmakuText(
                item.content.sender,
                item.content.systemType,
                item.content.content,
              )}
            </motion.div>
          </div>
        ))}
    </div>
  ));

  return (
    <>
      <div
        ref={trackRef}
        className="pointer-events-none absolute inset-x-0 top-0 h-[20%]"
      >
        <span
          ref={probeRef}
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 whitespace-nowrap text-lg font-bold tracking-[0.2em] opacity-0"
        />
      </div>
      {box && layer
        ? createPortal(
          <div
            className="pointer-events-none absolute flex flex-col overflow-visible"
            style={{ top: box.top, left: box.left, width: box.width, height: box.height }}
          >
            {lanes}
          </div>,
          layer,
        )
        : null}
    </>
  );
};

export default DanmakuOverlay;
