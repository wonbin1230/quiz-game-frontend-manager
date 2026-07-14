import React, { useState, useEffect } from 'react';
import { InitializeSocketSystem } from './socket';

import './App.css';
import QuizGame from './pages/QuizGame';

const App = () => {

	useEffect(() => {
    InitializeSocketSystem();
	}, []);

	return (
		<>
      <div className='min-h-screen bg-base-200 p-4'>
        <QuizGame/>
      </div>
		</>
	);
};

export default App;
