import React, { useCallback, useEffect, useState } from 'react';
import api from '../../api';
import SettingsField from './SettingsField';

const deviceOptions = ['Projector 4K', 'Smart TV', 'Whiteboard', 'Mic System', 'Video Conference', 'TV Screen', 'Premium Mic', 'Speakers'];
const errorText = (error) => error.response?.data?.detail || error.response?.data?.message || error.message || 'Something went wrong.';
const emptyRoom = { name: '', capacity: '', devices: [] };

export default function RoomsPanel({ isAdmin }) {
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState(emptyRoom);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const loadRooms = useCallback(async () => {
    try { const { data } = await api.get('/meeting-rooms/'); setRooms(Array.isArray(data) ? data : []); }
    catch (err) { setError(errorText(err)); }
  }, []);
  useEffect(() => { loadRooms(); }, [loadRooms]);
  const beginEdit = (item) => { setEditingId(item.id); setRoom({ name: item.name || '', capacity: item.capacity ?? '', devices: Array.isArray(item.devices) ? item.devices : [] }); setError(''); };
  const reset = () => { setEditingId(null); setRoom(emptyRoom); };
  const toggleDevice = (device) => setRoom((prev) => ({ ...prev, devices: prev.devices.includes(device) ? prev.devices.filter((entry) => entry !== device) : [...prev.devices, device] }));
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    const payload = { name: room.name, capacity: Number(room.capacity), devices: room.devices };
    try {
      if (editingId) await api.put(`/meeting-rooms/${editingId}`, payload);
      else await api.post('/meeting-rooms/', payload);
      reset(); await loadRooms();
    } catch (err) { setError(errorText(err)); }
    finally { setSaving(false); }
  };
  const remove = async (item) => {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    setError('');
    try { await api.delete(`/meeting-rooms/${item.id}`); await loadRooms(); }
    catch (err) { setError(errorText(err)); }
  };
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold text-slate-900">Rooms</h2><p className="mt-1 text-sm text-slate-500">Manage meeting rooms and equipment.</p>
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      <div className="mt-5 space-y-3">{rooms.map((item) => <article key={item.id} className="rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold text-slate-900">{item.name}</h3><p className="text-sm text-slate-500">{item.capacity} people</p></div>
          <div className="flex gap-2"><button type="button" disabled={!isAdmin} onClick={() => beginEdit(item)} className="text-sm font-semibold text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">Edit</button><button type="button" disabled={!isAdmin} onClick={() => remove(item)} className="text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-50">Delete</button></div>
        </div><div className="mt-3 flex flex-wrap gap-2">{(item.devices || []).map((device) => <span key={device} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{device}</span>)}</div>
      </article>)}</div>
      {!rooms.length && <p className="mt-4 text-sm text-slate-500">No rooms found.</p>}
      <form onSubmit={save} className="mt-6 space-y-4 border-t border-slate-100 pt-5">
        <h3 className="font-semibold text-slate-900">{editingId ? 'Edit room' : 'Add room'}</h3>
        <SettingsField label="Name" value={room.name} onChange={(e) => setRoom((prev) => ({ ...prev, name: e.target.value }))} required disabled={!isAdmin} />
        <SettingsField label="Capacity" type="number" min="1" value={room.capacity} onChange={(e) => setRoom((prev) => ({ ...prev, capacity: e.target.value }))} required disabled={!isAdmin} />
        <fieldset disabled={!isAdmin}><legend className="mb-2 text-sm font-medium text-slate-700">Devices</legend><div className="flex flex-wrap gap-2">{deviceOptions.map((device) => <button key={device} type="button" disabled={!isAdmin} onClick={() => toggleDevice(device)} className={`rounded-full border px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50 ${room.devices.includes(device) ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>{device}</button>)}</div></fieldset>
        <div className="flex gap-2"><button type="submit" disabled={!isAdmin || saving} className="rounded-xl bg-[#564BFF] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save room'}</button>{editingId && <button type="button" disabled={!isAdmin} onClick={reset} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-50">Cancel</button>}</div>
      </form>
    </section>
  );
}
