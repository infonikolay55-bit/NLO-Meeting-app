import React from 'react';

const capitalizeRole = (role) => role ? String(role).charAt(0).toUpperCase() + String(role).slice(1) : '';

export default function SettingsProfileCard({ user, profileImage, onClick }) {
  const name = user?.name || user?.fullName || user?.full_name || '';
  const role = capitalizeRole(user?.role);
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-indigo-200 sm:p-5">
      {profileImage ? <img src={profileImage} alt="Profile" className="h-14 w-14 shrink-0 rounded-full border border-slate-200 object-cover" /> :
        <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#564BFF] text-xl font-semibold text-white">{name.trim().charAt(0).toUpperCase()}</span>}
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="max-w-full break-words text-base font-bold text-slate-900">{name}</span>
          {role && <span className="rounded-full bg-[#F0EFFF] px-2 py-1 text-[11px] font-bold text-[#564BFF]">{role}</span>}
        </span>
        <span className="mt-1 block break-all text-sm text-slate-500">{user?.email || ''}</span>
      </span>
      <span aria-hidden="true" className="text-slate-300">›</span>
    </button>
  );
}
