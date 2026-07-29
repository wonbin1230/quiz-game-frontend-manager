import React from 'react';
import { motion } from 'framer-motion';

import { useGameStore } from '../stores/gameStore';
import { GamePhase, IRankingEntry } from '../types/game';
import FinishGameButton from './buttons/FinishGameButton';

const formatTime = (totalTime: number) => `${totalTime.toFixed(2)}s`;

const podiumOrder = [1, 0, 2] as const;

const podiumStyle = [
  { height: 'h-36', nameSize: 'text-2xl', rankSize: 'text-5xl', opacity: 'text-white' },
  { height: 'h-28', nameSize: 'text-xl', rankSize: 'text-4xl', opacity: 'text-white/85' },
  { height: 'h-24', nameSize: 'text-lg', rankSize: 'text-3xl', opacity: 'text-white/75' },
] as const;

const PodiumCard = ({
  entry,
  visualPlace,
}: {
  entry: IRankingEntry,
  visualPlace: 0 | 1 | 2,
}) => {
  const style = podiumStyle[visualPlace];

  return (
    <motion.div
      className="flex w-[28%] flex-col items-center gap-3"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + visualPlace * 0.12, duration: 0.55, ease: 'easeOut' }}
    >
      <div className={`text-center tracking-[0.2em] ${style.opacity}`}>
        <div className={`${style.rankSize} font-semibold`}>{entry.rank}</div>
        <div className={`mt-2 truncate ${style.nameSize} tracking-[0.15em]`}>
          {entry.userId}
        </div>
        <div className="mt-2 text-sm tracking-[0.12em] text-white/55">
          {entry.correctCount} 題 · {formatTime(entry.totalTime)}
        </div>
      </div>
      <div
        className={[
          'w-full rounded-sm border border-white/25 bg-white/5 backdrop-blur-sm',
          style.height,
        ].join(' ')}
      />
    </motion.div>
  );
};

const RankingRow = ({
  entry,
  index,
}: {
  entry: IRankingEntry,
  index: number,
}) => (
  <motion.div
    className="grid grid-cols-[3rem_1fr_4.5rem_6rem] items-center gap-3 border-b border-white/10 py-2.5 text-base tracking-[0.12em] text-white/75"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.45 + index * 0.05, duration: 0.4, ease: 'easeOut' }}
  >
    <span className="text-white/90">{entry.rank}</span>
    <span className="truncate text-white/85">{entry.userId}</span>
    <span className="text-right text-white/60">{entry.correctCount} 題</span>
    <span className="text-right text-white/60">{formatTime(entry.totalTime)}</span>
  </motion.div>
);

const ShowRanking = () => {
  const rankings = useGameStore((s) => s.rankings);
  const phase = useGameStore((s) => s.phase);

  if (!rankings || rankings.length === 0) return null;

  const podiumEntries = rankings.slice(0, 3);
  const listEntries = rankings.slice(3);
  const showFinishButton = phase === GamePhase.ShowRanking;

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-6">
      <motion.div
        className="shrink-0 text-center text-3xl tracking-[0.35em] text-white/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        幸福排行榜
      </motion.div>

      <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-2">
        <div className="flex items-end justify-center gap-4 pt-2">
          {podiumOrder.map((sourceIndex) => {
            const entry = podiumEntries[sourceIndex];
            if (!entry) return null;

            return (
              <PodiumCard
                key={`${entry.userId}-${entry.rank}-${sourceIndex}`}
                entry={entry}
                visualPlace={sourceIndex}
              />
            );
          })}
        </div>

        {listEntries.length > 0 && (
          <div className="mx-auto w-full max-w-3xl">
            <div className="grid grid-cols-[3rem_1fr_4.5rem_6rem] gap-3 border-b border-white/20 pb-2 text-sm tracking-[0.2em] text-white/45">
              <span>名次</span>
              <span>玩家</span>
              <span className="text-right">答對</span>
              <span className="text-right">時間</span>
            </div>
            {listEntries.map((entry, index) => (
              <RankingRow
                key={`${entry.userId}-${entry.rank}-${index}`}
                entry={entry}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex h-14 shrink-0 items-center justify-center">
        {showFinishButton ? (
          <FinishGameButton />
        ) : (
          <motion.div
            className="text-lg tracking-[0.3em] text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            已圓滿結束
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ShowRanking;
