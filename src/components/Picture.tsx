import React from 'react';

interface IPictureProps {
  src: string,
  alt: string,
}

// rounded-xl border-4 border-black bg-base-300 好看邊框

const Picture = (props: IPictureProps) => {
  return (
    <>
      <div className={`absolute bottom-8 ${props.alt === 'left' ? 'left-4' : 'right-4'} h-80 w-80`}>
        <img
          src={props.src}
          alt={props.alt ?? ''}
          className='h-full w-full object-cover'
        />
      </div>
    </>
  );
};

export default Picture;