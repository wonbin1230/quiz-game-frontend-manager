import React, { useEffect, useState } from 'react';

import './CardCarousel.css';

interface ICardCarouselProps {
  images: string[],
  /** 一圈旋轉秒數，預設 20 */
  durationSec?: number,
}

/** 對齊 CSS --card-w: clamp(360px, 45vw, 720px) */
function getCardWidthPx() {
  if (typeof window === 'undefined') return 520;
  return Math.min(560, Math.max(360, window.innerWidth * 0.5));
}

const CardCarousel = ({ images, durationSec = 40 }: ICardCarouselProps) => {
  const count = images.length;
  const [cardWidth, setCardWidth] = useState(getCardWidthPx);

  useEffect(() => {
    const onResize = () => setCardWidth(getCardWidthPx());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (count === 0) return null;

  const angleStep = 360 / count;
  const delayStep = durationSec / count;
  // 依張數與卡片寬度算出大致不重疊的半徑
  const radius =
    count === 1
      ? 0
      : Math.round((cardWidth / 2) / Math.tan(Math.PI / count) * 1.15);

  return (
    <div
      className='card-carousel'
      style={
        {
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
  );
};

export default CardCarousel;
