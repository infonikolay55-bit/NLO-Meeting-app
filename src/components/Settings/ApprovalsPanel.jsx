import React from 'react';

export default function ApprovalsPanel() {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <h2 className="text-lg font-bold text-slate-900">Approvals</h2>
    <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm leading-6 text-indigo-900">Bookings that require approval will appear here for Admins and Approvers to approve or reject.</div>
    <div className="mt-4 rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">No pending approvals</div>
  </section>;
}
