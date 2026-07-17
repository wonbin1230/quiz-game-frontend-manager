import React, { type ButtonHTMLAttributes } from 'react';

type GameButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const baseClassName = [
  'min-w-[220px] px-10 py-3.5',
  'rounded-sm border border-white/25 bg-white/5',
  'text-lg tracking-[0.35em] text-white/80',
  'backdrop-blur-sm transition-all duration-300',
  'hover:enabled:border-white/50 hover:enabled:bg-white/10 hover:enabled:text-white',
  'active:enabled:scale-[0.98]',
  'disabled:cursor-not-allowed disabled:opacity-35',
].join(' ');

const GameButton = ({ className, type = 'button', children, ...props }: GameButtonProps) => {
  return (
    <button
      type={type}
      className={className ? `${baseClassName} ${className}` : baseClassName}
      {...props}
    >
      {children}
    </button>
  );
};

export default GameButton;
