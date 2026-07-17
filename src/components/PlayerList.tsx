import React, { useEffect, useRef, useState } from 'react';

import { usePlayerListStore } from '../stores/playerStore';

import PlayerCount from './PlayerCount';
import StartGameButton from './buttons/StartGameButton';

const MAX_ROWS = 20;
const MAX_COLS = 10;
const NAME_COLOR = [
  'text-white',
  'text-white/80',
  'text-white/65',
  'text-white/90',
  'text-white/70',
];

const PlayerList = () => {
	const { list } = usePlayerListStore();
	const listRef = useRef<HTMLDivElement>(null);
	const rowMeasureRef = useRef<HTMLDivElement>(null);
	const [rowsPerCol, setRowsPerCol] = useState(MAX_ROWS);

	useEffect(() => {
		const listEl = listRef.current;
		const rowEl = rowMeasureRef.current;
		if (!listEl || !rowEl) return;

		const updateRows = () => {
			const rowHeight = rowEl.offsetHeight;
			if (rowHeight <= 0) return;

			const style = getComputedStyle(listEl);
			const paddingY =
				parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
			const contentHeight = listEl.clientHeight - paddingY;
			const nextRows = Math.min(
				MAX_ROWS,
				Math.max(1, Math.floor(contentHeight / rowHeight)),
			);

			setRowsPerCol((prev) => (prev === nextRows ? prev : nextRows));
		};

		const observer = new ResizeObserver(updateRows);
		observer.observe(listEl);
		observer.observe(rowEl);
		updateRows();

		return () => observer.disconnect();
	}, []);

	const displayList = list.slice(0, rowsPerCol * MAX_COLS);
	const columns = Array.from(
		{ length: Math.ceil(displayList.length / rowsPerCol) || 0 },
		(_, colIndex) =>
			displayList.slice(colIndex * rowsPerCol, (colIndex + 1) * rowsPerCol),
	);

	return (
		<div className="flex h-full min-h-0 flex-col gap-2">
			<div
				ref={listRef}
				className="relative min-h-0 w-full flex-1 overflow-y-auto p-3! text-base tracking-[0.15em]"
			>
				{/* 量測單列高度用，不佔版面 */}
				<div
					ref={rowMeasureRef}
					className="invisible pointer-events-none absolute truncate"
					aria-hidden
				>
					Ag
				</div>
				<div className="flex gap-2">
					{columns.map((column, colIndex) => (
						<div key={colIndex} className="flex w-[9.5%] flex-col">
							{column.map((player, rowIndex) => {
								const playerIndex = colIndex * rowsPerCol + rowIndex;
								return (
									<div
										key={playerIndex}
										className={`truncate ${NAME_COLOR[playerIndex % NAME_COLOR.length]}`}
									>
										{player}
									</div>
								);
							})}
						</div>
					))}
				</div>
			</div>
			<div className="shrink-0 flex flex-col gap-2">
				<PlayerCount />
				<div className="flex h-14 shrink-0 items-center justify-center">
					<StartGameButton />
				</div>
			</div>
		</div>
	);
};

export default PlayerList;
