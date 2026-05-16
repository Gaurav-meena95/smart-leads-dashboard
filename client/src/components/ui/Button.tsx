import React, { type ButtonHTMLAttributes } from 'react';
import { classNames } from '../../utils/helpers';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className, 
  ...props 
}) => {
  const baseClasses = "inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none transition-colors";
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-dark",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-danger text-white hover:bg-red-600",
  };

  return (
    <button 
      className={classNames(baseClasses, variantClasses[variant], className, isLoading ? 'opacity-75 cursor-not-allowed' : '')}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      ) : null}
      {children}
    </button>
  );
};
