import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

import { useDanmakuStore } from '../stores/danmakuStore';
import { DanmakuSystemType } from '../types/danmaku';

const DURATION_SEC = 6;

const formatText = (sender: string, systemType: DanmakuSystemType, content: string) => {
  if (systemType === DanmakuSystemType.PlayerJoin) {
    return `${sender} ${content || '已加入房間'}`;
  }
  return content ? `${sender} ${content}` : sender;
};

const DanmakuOverlay = () => {
  const { items, removeItem, clear } = useDanmakuStore();

  useEffect(() => {
    return () => clear();
  }, [clear]);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-50 h-[20%] overflow-hidden">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute whitespace-nowrap text-2xl font-semibold text-yellow-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          style={{ top: `${item.topPercent}%` }}
          initial={{ x: '100vw' }}
          animate={{ x: '-100%' }}
          transition={{ duration: DURATION_SEC, ease: 'linear' }}
          onAnimationComplete={() => removeItem(item.id)}
        >
          {formatText(item.content.sender, item.content.systemType, item.content.content)}
        </motion.div>
      ))}
    </div>
  );
};

export default DanmakuOverlay;
