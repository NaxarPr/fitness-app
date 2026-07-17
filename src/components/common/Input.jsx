import React from 'react';

const Input = ({
  type = 'text',
  className = '',
  ...props
}) => {
  const baseStyles = 'w-full h-8 px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-sm focus:outline-none focus:border-primary transition-colors duration-200';
  
  return (
    <input
      {...props}
      className={`${baseStyles} ${className}`}
      type={type}
    />
  );
};

export default Input;
