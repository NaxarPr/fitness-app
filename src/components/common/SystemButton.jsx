import React from 'react';

const SystemButton = ({
  type = 'primary',
  className = '',
  ...props
}) => {
  const baseStyles = type === 'primary' ? 'bg-blue-500' : 'bg-gray-500';
  
  return (
    <button
      {...props}
      className={`${baseStyles} ${className} text-white px-4 py-1 rounded disabled:opacity-30`}
    />
  );
};

export default SystemButton;
