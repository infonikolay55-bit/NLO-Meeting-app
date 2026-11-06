import React, { useState } from 'react';

export default function SettingsSwitch({ label, checked, onChange, defaultChecked = false, disabled = false }) {
  const controlled = checked !== undefined && typeof onChange === 'function';
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = controlled ? checked : internalChecked;
  const toggle = () => {
    if (disabled) return;
    if (controlled) onChange(!isChecked);
    else setInternalChecked((current) => !current);
  };
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <button type="button" role="switch" aria-checked={isChecked} aria-label={label} disabled={disabled} onClick={toggle}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${isChecked ? 'bg-[#564BFF]' : 'bg-slate-300'}`}>
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${isChecked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}
