import { useEffect, useState } from 'react';

type TypingStage = {
  text: string,
  charMs: number,
  /** 此段打完後的停頓（最後一段可省略） */
  pauseAfterMs?: number,
};

/**
 * 分段打字：依序打出各段文字，段與段之間可停頓；不退字。
 */
export const useStagedTypingText = (
  enabled: boolean,
  stages: TypingStage[],
  onComplete?: () => void,
) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!enabled) {
      setDisplayText('');
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let full = '';

    const clear = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    const runStage = (stageIndex: number, charIndex: number) => {
      if (cancelled) return;

      if (stageIndex >= stages.length) {
        if (!cancelled) onComplete?.();
        return;
      }

      const stage = stages[stageIndex];

      if (charIndex < stage.text.length) {
        full += stage.text[charIndex];
        setDisplayText(full);
        timer = setTimeout(
          () => runStage(stageIndex, charIndex + 1),
          stage.charMs,
        );
        return;
      }

      const pause = stage.pauseAfterMs ?? 0;
      if (pause > 0) {
        timer = setTimeout(() => runStage(stageIndex + 1, 0), pause);
        return;
      }

      runStage(stageIndex + 1, 0);
    };

    setDisplayText('');
    runStage(0, 0);

    return () => {
      cancelled = true;
      clear();
    };
    // stages 由呼叫端固定常數／preset，不列入 deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return displayText;
};
