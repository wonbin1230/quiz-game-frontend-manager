import React from 'react';
import { motion } from 'framer-motion';

import AnswerStamp from './AnswerStamp';

interface ISettleOptionProps {
	label: string,
	text: string,
	votes: number,
	totalVotes: number,
	color?: string,
	showAnswerStamp?: boolean,
}

export const SettleOption = ({
	label,
	text,
	votes,
	totalVotes,
	color = 'bg-primary',
	showAnswerStamp = false,
}: ISettleOptionProps) => {
	const percentage = totalVotes === 0 ? 0 : (votes / totalVotes) * 100;

	return (
		<div
			className={`relative rounded-xl border border-base-300 bg-base-100 p-4 ${
				showAnswerStamp ? 'z-10 overflow-visible' : 'overflow-hidden'
			}`}
		>
			{/* 進度條背景 */}
			<div className="absolute inset-0 overflow-hidden rounded-xl">
				<motion.div
					className={`absolute inset-y-0 left-0 ${color} opacity-30`}
					initial={{ width: 0 }}
					animate={{ width: `${percentage}%` }}
					transition={{
						duration: 0.6,
						ease: 'easeOut',
					}}
				/>
			</div>

			{/* 內容 */}
			<div className="relative z-10 grid grid-cols-[40px_1fr_60px] h-full items-center">
				<div className="flex items-center justify-center font-bold text-4xl">{label}</div>

				<div className="flex items-center justify-center text-center leading-none text-4xl">
					<span className="block">{text}</span>
				</div>

				<div className="text-right font-bold text-sm pr-2">{Math.round(percentage)}%</div>
			</div>

			<AnswerStamp active={showAnswerStamp} />
		</div>
	);
};

export default SettleOption;
