import React from 'react';

import QuizContent from './QuizContent';
import Picture from './Picture';

const MainContent = () => {
  return (
    <>
      <div className='flex h-[calc(100vh-8rem)] items-center justify-center p-8!'>
        <Picture src='/left.png' alt='left' />
        <Picture src='/right.png' alt='right' />
        <QuizContent />
      </div>
    </>
  );
};

export default MainContent;