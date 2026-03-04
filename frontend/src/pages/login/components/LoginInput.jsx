import React from 'react';

export default function LoginInput({ label, id, name, type = 'text', value, onChange, placeholder, required = true }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-[#2A3240]">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A3240] focus:border-[#2A3240] transition-colors duration-200"
        />
      </div>
    </div>
  );
}