import React from 'react';

interface IOptionProps {
	label: string,
	text: string,
	highlighted?: boolean,
}

export const Option = ({
	label,
	text,
	highlighted = false,
}: IOptionProps) => {
	return (
		<div
			className={`relative overflow-hidden rounded-xl border bg-white/70 p-4 backdrop-blur-sm transition-all duration-300 ${
				highlighted
					? 'border-gold shadow-[0_0_0_1px_rgba(176,138,88,0.45),0_0_24px_rgba(231,180,190,0.55)]'
					: 'border-blush/80'
			}`}
		>
			<div className="relative z-10 grid h-full grid-cols-[40px_1fr] items-center">
				<div className="flex items-center justify-center text-3xl font-bold tracking-[0.2em] text-gold">
					{label}
				</div>

				<div className="flex items-center justify-center text-center text-2xl font-bold leading-snug tracking-[0.08em] text-ink">
					<span className="block">{text}</span>
				</div>
			</div>
		</div>
	);
};

export default Option;
