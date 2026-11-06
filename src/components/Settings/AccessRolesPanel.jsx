import React, { useCallback, useEffect, useState } from 'react';
import api from '../../api';
import SettingsSwitch from './SettingsSwitch';

const errorText = (error) => error.response?.data?.detail || error.response?.data?.message || error.message || 'Something went wrong.';

export default function AccessRolesPanel({ isAdmin }) {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const loadMembers = useCallback(async () => {
    try { const { data } = await api.get('/users/'); setMembers(Array.isArray(data) ? data : []); }
    catch (err) { setError(errorText(err)); }
  }, []);
  useEffect(() => { loadMembers(); }, [loadMembers]);
  const change = async (member, field, value) => {
    const oldValue = member[field];
    setError('');
    setMembers((prev) => prev.map((row) => row.id === member.id ? { ...row, [field]: value } : row));
    try {
      if (field === 'role') await api.patch(`/users/${member.id}/role`, { role: value });
      else await api.patch(`/users/${member.id}/active`, { is_active: value });
    } catch (err) {
      setMembers((prev) => prev.map((row) => row.id === member.id ? { ...row, [field]: oldValue } : row));
      setError(errorText(err));
    }
  };
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <h2 className="text-lg font-bold text-slate-900">Access &amp; roles</h2><p className="mt-1 text-sm text-slate-500">Manage workspace members and access.</p>
    {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
    <div className="mt-5 space-y-3">{members.map((member) => {
      const name = member.name || member.fullName || member.full_name || '';
      return <article key={member.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-[minmax(0,1fr)_130px_130px] sm:items-center">
        <div className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">{name.trim().charAt(0).toUpperCase()}</span><div className="min-w-0"><p className="truncate font-semibold text-slate-900">{name}</p><p className="truncate text-sm text-slate-500">{member.email}</p><p className="truncate text-xs text-slate-400">{member.position || ''}</p></div></div>
        <label className="text-sm font-medium text-slate-700">Role<select aria-label={`Role for ${name}`} disabled={!isAdmin} value={member.role || 'member'} onChange={(event) => change(member, 'role', event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-2 py-2 disabled:bg-slate-100">{['member', 'approver', 'admin'].map((role) => <option key={role} value={role}>{role}</option>)}</select></label>
        <SettingsSwitch label="Active" checked={Boolean(member.is_active)} onChange={(value) => change(member, 'is_active', value)} disabled={!isAdmin} />
      </article>;
    })}</div>
  </section>;
}
