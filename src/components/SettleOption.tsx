import React from 'react';
import { motion } from 'framer-motion';

import AnswerRose from './AnswerRose';

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
		<div className={`relative h-full min-h-0 overflow-visible ${showAnswerStamp ? 'z-30' : 'z-0'}`}>
			<motion.div
				className={`relative flex h-full flex-col justify-between gap-3 overflow-hidden rounded-xl border-2 bg-white/70 p-4 backdrop-blur-sm ${
					showAnswerStamp ? 'border-[#c98996]' : 'border-blush/80'
				} ${dimmed ? 'opacity-45' : 'opacity-100'}`}
				initial={false}
				animate={
					showAnswerStamp
						? {
							boxShadow: [
								'0 0 0 1px rgba(201,137,150,0.35), 0 0 10px rgba(231,180,190,0.28)',
								'0 0 0 3px rgba(201,137,150,0.7), 0 0 22px rgba(231,180,190,0.55)',
								'0 0 0 1px rgba(201,137,150,0.35), 0 0 10px rgba(231,180,190,0.28)',
							],
						}
						: { boxShadow: '0 0 0 0 rgba(168,77,92,0)' }
				}
				transition={
					showAnswerStamp
						? { duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }
						: { duration: 0.3 }
				}
			>
				{showAnswerStamp && (
					<motion.div
						className="pointer-events-none absolute inset-0 rounded-[10px] border-2 border-[#f0c4cb]"
						initial={{ opacity: 0 }}
						animate={{ opacity: [0.25, 0.7, 0.25] }}
						transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }}
					/>
				)}
				<div className="relative grid min-h-0 flex-1 grid-cols-[40px_1fr] content-center items-center">
					<div className="flex items-center justify-center text-3xl font-bold tracking-[0.2em] text-gold">
						{label}
					</div>
					<div className="flex items-center justify-center text-center text-2xl font-bold leading-snug tracking-[0.08em] text-ink">
						<span className="block">{text}</span>
					</div>
				</div>

				<div className="relative flex shrink-0 items-end gap-3">
					<div className="min-w-0 flex-1 pb-1">
						<div className="h-2 overflow-hidden rounded-full bg-blush/35">
							<motion.div
								className={`h-full rounded-full ${
									showAnswerStamp
										? 'bg-gold shadow-[0_0_12px_rgba(176,138,88,0.55)]'
										: 'bg-gold/75 shadow-[0_0_10px_rgba(176,138,88,0.35)]'
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
						<span className="text-2xl font-bold tracking-[0.08em] text-ink">
							{Math.round(percentage)}%
						</span>
						<span className="mt-1 text-xs tracking-[0.12em] text-ink/55">
							{votes} 票
						</span>
					</div>
				</div>
			</motion.div>
			<AnswerRose active={showAnswerStamp} />
		</div>
	);
};

export default SettleOption;
