import React, { type ButtonHTMLAttributes } from 'react';

type GameButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const baseClassName = [
  'min-w-[220px] px-10 py-3.5',
  'rounded-full border border-gold/70 bg-white/75',
  'text-lg tracking-[0.35em] text-gold',
  'backdrop-blur-sm transition-all duration-300',
  'hover:enabled:border-gold hover:enabled:bg-blush/25 hover:enabled:text-ink',
  'active:enabled:scale-[0.98]',
  'disabled:cursor-not-allowed disabled:border-gold/40 disabled:bg-white/50 disabled:text-gold/55',
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
