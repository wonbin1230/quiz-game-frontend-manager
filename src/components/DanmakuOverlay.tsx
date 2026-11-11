import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import {
  formatDanmakuText,
  LANE_COUNT,
  setDanmakuTrackMetrics,
  useDanmakuStore,
} from '../stores/danmakuStore';

const LANES = Array.from({ length: LANE_COUNT }, (_, lane) => lane);

const DanmakuOverlay = () => {
  const { items, removeItem, clear } = useDanmakuStore();
  const trackRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);

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
      if (!track) return;
      setDanmakuTrackMetrics({
        viewportWidth: window.innerWidth,
        offsetLeft: track.getBoundingClientRect().left,
        measure,
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

  return (
    <div
      ref={trackRef}
      className="pointer-events-none absolute inset-x-0 top-0 z-50 flex h-[20%] flex-col overflow-visible"
    >
      <span
        ref={probeRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 whitespace-nowrap text-lg tracking-[0.2em] opacity-0"
      />
      {LANES.map((lane) => (
        <div key={lane} className="relative min-h-0 flex-1 overflow-visible">
          {items
            .filter((item) => item.lane === lane)
            .map((item) => (
              <div
                key={item.id}
                className="absolute top-1/2 left-0 -translate-y-1/2"
              >
                <motion.div
                  className="whitespace-nowrap text-lg tracking-[0.2em] text-white/80"
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
      ))}
    </div>
  );
};

export default DanmakuOverlay;
