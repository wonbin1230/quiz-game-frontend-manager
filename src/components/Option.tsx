import React from 'react';

interface IOptionProps {
	label: string,
	text: string,
	color?: string,
	highlighted?: boolean,
}

export const Option = ({
	label,
	text,
	color = 'bg-primary',
	highlighted = false,
}: IOptionProps) => {
	return (
		<div
			className={`relative overflow-hidden rounded-xl border border-base-300 p-4 transition-colors duration-300 ${
				highlighted ? `${color}` : 'bg-base-100'
			}`}
		>
			<div className="relative z-10 grid grid-cols-[40px_1fr] h-full items-center">
				<div className="flex items-center justify-center font-bold text-4xl">{label}</div>

				<div className="flex items-center justify-center text-center leading-none text-4xl">
					<span className="block">{text}</span>
				</div>
			</div>
		</div>
	);
};

export default Option;
