import React from 'react';

const groups = [
  { title: 'ACCOUNT', items: [{ key: 'profile', label: 'Profile' }] },
  { title: 'WORKSPACE', items: [
    { key: 'booking-rules', label: 'Booking rules' },
    { key: 'rooms', label: 'Rooms', admin: true },
    { key: 'approvals', label: 'Approvals', admin: true },
    { key: 'calendar', label: 'Calendar integrations', admin: true },
    { key: 'access-roles', label: 'Access & roles', admin: true },
  ] },
  { title: 'PREFERENCES', items: [
    { key: 'notifications', label: 'Notifications' },
    { key: 'records', label: 'Meeting records', admin: true },
  ] },
];

export default function SettingsMenu({ activePanel, isAdmin, onSelect }) {
  return (
    <nav aria-label="Settings" className="space-y-4">
      {groups.map((group) => (
        <section key={group.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-xs font-bold tracking-wide text-slate-500">{group.title}</h2>
          <div className="divide-y divide-slate-100">
            {group.items.map((item) => {
              const disabled = Boolean(item.admin && !isAdmin);
              return (
                <button key={item.key} type="button" disabled={disabled} onClick={() => onSelect(item.key)}
                  aria-current={activePanel === item.key ? 'page' : undefined}
                  className={`flex min-h-12 w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold ${activePanel === item.key ? 'bg-[#F8F7FF] text-[#564BFF]' : 'text-slate-700'} ${disabled ? 'cursor-not-allowed opacity-45' : 'hover:bg-slate-50'}`}>
                  <span>{item.label}</span>
                  <span className="flex items-center gap-2">
                    {item.admin && <span className="rounded-full bg-[#F0EFFF] px-2 py-1 text-[10px] font-bold text-[#564BFF]">Admin only</span>}
                    <span aria-hidden="true" className="text-slate-300">›</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </nav>
  );
}
