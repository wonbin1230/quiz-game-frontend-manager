import React from 'react';

import { usePlayerListStore } from '../stores/playerStore';

import PlayerCount from './PlayerCount';
import StartGameButton from './StartGameButton';

const MAX_ROWS = 20;
const MAX_COLS = 10;
const NAME_COLOR = [
  'text-red-300',
  'text-green-300',
  'text-blue-300',
  'text-yellow-300',
  'text-purple-300',
];

const PlayerList = () => {
	const { list } = usePlayerListStore();

	const displayList = list.slice(0, MAX_ROWS * MAX_COLS);

	const columns = Array.from({ length: Math.ceil(displayList.length / MAX_ROWS) }, (_, colIndex) => displayList.slice(colIndex * MAX_ROWS, (colIndex + 1) * MAX_ROWS));

	return (
		<div className="flex h-full flex-col gap-2">
			<div className="flex-10 items-center justify-center h-full w-full text-xl p-3!">
				<div className="flex h-full gap-2 overflow-hidden">
					{columns.map((column, colIndex) => (
						<div key={colIndex} className='flex w-[9.5%] flex-col bg-base-300'>
							{column.map((player, rowIndex) => {
								const playerIndex = colIndex * MAX_ROWS + rowIndex;
								return (
									<div key={playerIndex} className={`truncate ${NAME_COLOR[playerIndex % NAME_COLOR.length]}`}>
										{player}
									</div>
								);
							})}
						</div>
					))}
				</div>
			</div>
			<StartGameButton />
			<PlayerCount />
		</div>
	);
};

export default PlayerList;
