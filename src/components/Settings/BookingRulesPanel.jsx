import React, { useEffect, useState } from 'react';
import api from '../../api';
import SettingsField from './SettingsField';
import SettingsSwitch from './SettingsSwitch';

const defaults = { approval_required: true, approver_admin: true, approver_approver: true, work_start: '09:00', work_end: '18:00', channel_email: true, channel_inapp: true };
const errorText = (error) => error.response?.data?.detail || error.response?.data?.message || error.message || 'Something went wrong.';

export default function BookingRulesPanel({ isAdmin }) {
  const [rules, setRules] = useState(defaults);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    api.get('/settings/booking-rules').then(({ data }) => setRules({ ...defaults, ...data })).catch((err) => setError(errorText(err)));
  }, []);
  const update = (key, value) => setRules((prev) => ({ ...prev, [key]: value }));
  const toggleRequired = (key) => update(key, !rules[key]);
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setError(''); setMessage('');
    try { await api.put('/settings/booking-rules', rules); setMessage('Booking rules saved.'); }
    catch (err) { setError(errorText(err)); }
    finally { setSaving(false); }
  };
  const pill = (label, key) => <button key={key} type="button" disabled={!isAdmin} onClick={() => {
    if (rules[key] && (key === 'approver_admin' || key === 'approver_approver') && !rules[key === 'approver_admin' ? 'approver_approver' : 'approver_admin']) return;
    toggleRequired(key);
  }} className={`rounded-full border px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${rules[key] ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>{label}</button>;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold text-slate-900">Booking rules</h2><p className="mt-1 text-sm text-slate-500">Configure booking approval and working hours.</p>
      <form onSubmit={save} className="mt-5 space-y-5">
        <SettingsSwitch label="Admin approval required before calendar blocking" checked={rules.approval_required} onChange={(value) => update('approval_required', value)} disabled={!isAdmin} />
        <fieldset disabled={!isAdmin} className="space-y-2 disabled:opacity-70"><legend className="text-sm font-semibold text-slate-800">Who can approve</legend><div className="flex gap-2">{pill('Admin', 'approver_admin')}{pill('Approver', 'approver_approver')}</div></fieldset>
        <div><h3 className="mb-2 text-sm font-semibold text-slate-800">Working hours</h3><div className="grid gap-3 sm:grid-cols-2"><SettingsField label="Start" type="time" value={rules.work_start} onChange={(e) => update('work_start', e.target.value)} disabled={!isAdmin} /><SettingsField label="End" type="time" value={rules.work_end} onChange={(e) => update('work_end', e.target.value)} disabled={!isAdmin} /></div></div>
        <fieldset disabled={!isAdmin} className="space-y-2 disabled:opacity-70"><legend className="text-sm font-semibold text-slate-800">Notification channels</legend><div className="flex gap-2">{pill('Email', 'channel_email')}{pill('In-app', 'channel_inapp')}</div></fieldset>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}{message && <p role="status" className="text-sm text-emerald-700">{message}</p>}
        {isAdmin && <button type="submit" disabled={saving} className="rounded-xl bg-[#564BFF] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save changes'}</button>}
      </form>
    </section>
  );
}
