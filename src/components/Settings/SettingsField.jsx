import React from 'react';

export default function SettingsField({ label, type = 'text', value, onChange, defaultValue, disabled = false, ...inputProps }) {
  const controlled = value !== undefined && (typeof onChange === 'function' || disabled || inputProps.readOnly);
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input {...inputProps} type={type} disabled={disabled}
        {...(controlled ? { value, ...(onChange ? { onChange } : {}) } : { defaultValue })}
        className={`w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 disabled:bg-slate-100 disabled:text-slate-500 ${inputProps.className || ''}`} />
    </label>
  );
}
