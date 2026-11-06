import React from 'react';

export default function CalendarIntegrationsPanel() {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <h2 className="text-lg font-bold text-slate-900">Calendar integrations</h2>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
      <div><h3 className="font-semibold text-slate-900">Google Calendar</h3><p className="mt-1 text-sm text-slate-500">Not connected</p></div>
      <button type="button" disabled className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-400">Connect</button>
    </div>
  </section>;
}
