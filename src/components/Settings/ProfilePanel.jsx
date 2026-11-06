import React, { useEffect, useState } from 'react';
import api from '../../api';
import SettingsField from './SettingsField';

const getError = (error) => error.response?.data?.detail || error.response?.data?.message || error.message || 'Something went wrong.';
const imageToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('Could not read the selected image.'));
  reader.readAsDataURL(file);
});

export default function ProfilePanel({ user, profileImage, setProfileImage }) {
  const [name, setName] = useState(user?.name || user?.fullName || user?.full_name || '');
  const [position, setPosition] = useState(user?.position || '');
  const [stagedImage, setStagedImage] = useState(null);
  const [preview, setPreview] = useState(profileImage || user?.image || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name || user?.fullName || user?.full_name || '');
    setPosition(user?.position || '');
  }, [user]);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await imageToDataUrl(file);
      setStagedImage(dataUrl);
      setPreview(dataUrl);
      setError('');
      setMessage('');
    } catch (err) { setError(getError(err)); }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true); setError(''); setMessage('');
    try {
      await api.put(`/users/${user.id}`, { name, position });
      if (stagedImage) {
        await api.put('/users/profile/image', { image: stagedImage });
        setProfileImage(stagedImage);
      }
      setMessage('Profile saved successfully.');
    } catch (err) { setError(getError(err)); }
    finally { setSaving(false); }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold text-slate-900">Profile</h2>
      <p className="mt-1 text-sm text-slate-500">Update your profile information.</p>
      <form onSubmit={handleSave} className="mt-5 space-y-4">
        <div className="flex items-center gap-4">
          {preview ? <img src={preview} alt="Profile preview" className="h-16 w-16 rounded-full border border-slate-200 object-cover" /> :
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-semibold text-white">{name.trim().charAt(0).toUpperCase()}</span>}
          <label className="text-sm font-semibold text-indigo-700">Choose profile image
            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 block max-w-full text-xs text-slate-500" />
          </label>
        </div>
        <SettingsField label="Name" value={name} onChange={(event) => setName(event.target.value)} required />
        <SettingsField label="Position" value={position} onChange={(event) => setPosition(event.target.value)} />
        <SettingsField label="Email" value={user?.email || ''} disabled readOnly />
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        {message && <p role="status" className="text-sm text-emerald-700">{message}</p>}
        <button type="submit" disabled={saving} className="rounded-xl bg-[#564BFF] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save profile'}</button>
      </form>
    </section>
  );
}
