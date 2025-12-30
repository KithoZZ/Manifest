import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'primary' | 'success' | 'warning' | 'light' | 'add-task' | 'remove-task' | 'danger';
  size?: 'sm';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'primary',
  size,
  onClick,
  className = '',
  disabled = false,
  style
}) => {
  const buttonClasses = [
    'btn',
    `btn-${type}`,
    size ? `btn-${size}` : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;
