import React from 'react';
import { motion } from 'framer-motion';

import AnswerStamp from './AnswerStamp';

interface ISettleOptionProps {
	label: string,
	text: string,
	votes: number,
	totalVotes: number,
	showAnswerStamp?: boolean,
	dimmed?: boolean,
}

export const SettleOption = ({
	label,
	text,
	votes,
	totalVotes,
	showAnswerStamp = false,
	dimmed = false,
}: ISettleOptionProps) => {
	const percentage = totalVotes === 0 ? 0 : (votes / totalVotes) * 100;

	return (
		<div
			className={`relative flex flex-col justify-between gap-3 rounded-sm border bg-white/5 p-4 backdrop-blur-sm transition-all duration-500 ${
				showAnswerStamp
					? 'z-10 overflow-visible border-white shadow-[0_0_0_1px_rgba(255,255,255,0.45),0_0_28px_rgba(255,255,255,0.28)]'
					: 'overflow-hidden border-white/25'
			} ${dimmed ? 'opacity-45' : 'opacity-100'}`}
		>
			{/* 上層：標籤 + 選項文字 */}
			<div className="relative z-10 flex min-h-0 flex-1 items-start gap-3">
				<div className="shrink-0 text-3xl font-semibold tracking-[0.2em] text-white">
					{label}
				</div>
				<div className="min-w-0 flex-1 text-left text-2xl leading-snug tracking-[0.08em] text-white/80">
					{text}
				</div>
			</div>

			{/* 下層：進度條 + 統計 */}
			<div className="relative z-10 flex shrink-0 items-end gap-3">
				<div className="min-w-0 flex-1 pb-1">
					<div className="h-2 overflow-hidden rounded-full bg-white/15">
						<motion.div
							className={`h-full rounded-full ${
								showAnswerStamp
									? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)]'
									: 'bg-white/75 shadow-[0_0_10px_rgba(255,255,255,0.45)]'
							}`}
							initial={{ width: 0 }}
							animate={{ width: `${percentage}%` }}
							transition={{
								duration: 0.6,
								ease: 'easeOut',
							}}
						/>
					</div>
				</div>

				<div className="flex shrink-0 flex-col items-end leading-none">
					<span className="text-2xl font-semibold tracking-[0.08em] text-white">
						{Math.round(percentage)}%
					</span>
					<span className="mt-1 text-xs tracking-[0.12em] text-white/45">
						{votes} 票
					</span>
				</div>
			</div>

			<AnswerStamp active={showAnswerStamp} />
		</div>
	);
};

export default SettleOption;
