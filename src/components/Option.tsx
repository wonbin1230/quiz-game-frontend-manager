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
			className={`relative overflow-hidden rounded-sm border bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 ${
				highlighted
					? 'border-white shadow-[0_0_0_1px_rgba(255,255,255,0.55),0_0_24px_rgba(255,255,255,0.35)]'
					: 'border-white/25'
			}`}
		>
			<div className="relative z-10 grid h-full grid-cols-[40px_1fr] items-center">
				<div className="flex items-center justify-center text-3xl font-semibold tracking-[0.2em] text-white">
					{label}
				</div>

				<div className="flex items-center justify-center text-center text-2xl leading-snug tracking-[0.08em] text-white/80">
					<span className="block">{text}</span>
				</div>
			</div>
		</div>
	);
};

export default Option;
