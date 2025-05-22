import React from 'react';

const Input = ({
  type = 'text',
  className = '',
  ...props
}) => {
  const baseStyles = 'w-full h-8 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:border-blue-500 transition-colors duration-200';
  
  return (
    <input
      {...props}
      className={`${baseStyles} ${className}`}
      type={type}
    />
  );
};

export default Input;
