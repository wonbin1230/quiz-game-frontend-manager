import { useEffect, useState } from 'react';

export const useTypingText = (
  text: string,
  speed = 50,
) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let index = 0;

    setDisplayText('');

    const timer = setInterval(() => {
      index++;

      setDisplayText(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return displayText;
};