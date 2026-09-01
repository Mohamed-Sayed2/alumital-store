import React from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, id }) => {
  const toggleId = id || label.replace(/\s+/g, '-').toLowerCase();

  return (
    <label htmlFor={toggleId} className="inline-flex items-center gap-3 cursor-pointer select-none">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <button
        type="button"
        role="switch"
        id={toggleId}
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
          checked ? 'bg-sky-500' : 'bg-slate-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? '-translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
};
