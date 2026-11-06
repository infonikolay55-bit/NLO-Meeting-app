import React, { useState } from 'react';

const periods = ['30 days', '90 days', '180 days', 'Never'];

export default function MeetingRecordsPanel() {
  const [retention, setRetention] = useState('90 days');
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <h2 className="text-lg font-bold text-slate-900">Meeting records</h2>
    <div className="mt-5"><h3 className="text-sm font-semibold text-slate-800">Recording retention</h3>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Recording retention">{periods.map((period) => <button key={period} type="button" aria-pressed={retention === period} onClick={() => setRetention(period)} className={`rounded-full border px-3 py-2 text-sm font-medium ${retention === period ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{period}</button>)}</div>
      <p className="mt-3 text-sm leading-6 text-slate-500">Recordings older than the selected period are deleted automatically.</p>
    </div>
  </section>;
}
