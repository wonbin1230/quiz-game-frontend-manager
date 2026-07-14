import React from 'react';
import { motion } from 'framer-motion';

interface IOptionProps {
	label: string,
	text: string,
	votes: number,
	totalVotes: number,
	color?: string,
}

export const Option = ({ label, text, votes, totalVotes, color = 'bg-primary' }: IOptionProps) => {
	const percentage = totalVotes === 0 ? 0 : (votes / totalVotes) * 100;

	return (
		<div className="relative overflow-hidden rounded-xl border border-base-300 bg-base-100 p-4">
			{/* 進度條背景 */}
			<motion.div
				className={`absolute inset-y-0 left-0 ${color} opacity-30`}
				initial={{ width: 0 }}
				animate={{ width: `${percentage}%` }}
				transition={{
					duration: 0.6,
					ease: 'easeOut',
				}}
			/>

			{/* 內容 */}
			<div className="relative z-10 grid grid-cols-[40px_1fr_60px] h-full items-center">
				<div className="flex items-center justify-center font-bold text-4xl">{label}</div>

				<div className="flex items-center justify-center text-center leading-none text-4xl">
					<span className="block">{text}</span>
				</div>

				<div className="text-right font-bold text-sm pr-2">{Math.round(percentage)}%</div>
			</div>
		</div>
	);
};

export default Option;
