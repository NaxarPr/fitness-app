import React, { useState, useRef, useEffect } from 'react';

const Select = ({
  className = '',
  options = [],
  value = '',
  onChange,
  placeholder = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const dropdownRef = useRef(null);
  const baseStyles = 'w-full h-8 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:border-blue-500 transition-colors duration-200';
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    setIsOpen(true);
    if (onChange) {
      onChange(e);
    }
  };

  const handleSelect = (option) => {
    setSearchValue(option);
    if (onChange) {
      onChange({ target: { value: option } });
    }
    setIsOpen(false);
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        className={`${baseStyles} ${className}`}
        value={searchValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        aria-label={placeholder || 'Select option'}
        {...props}
      />
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute w-full mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-50 max-h-60 overflow-y-auto">
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-700 cursor-pointer text-sm"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;

