import React, { useState } from 'react';
import SettingsSwitch from './SettingsSwitch';

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState({ email: true, inapp: true, reminders: true, actionItems: true });
  const items = [
    ['email', 'Email notifications'],
    ['inapp', 'In-app notifications'],
    ['reminders', 'Meeting reminders'],
    ['actionItems', 'Action item updates'],
  ];
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <h2 className="text-lg font-bold text-slate-900">Notifications</h2><p className="mt-1 text-sm text-slate-500">Choose which updates you want to see.</p>
    <div className="mt-5 divide-y divide-slate-100">{items.map(([key, label]) => <SettingsSwitch key={key} label={label} checked={notifications[key]} onChange={(value) => setNotifications((prev) => ({ ...prev, [key]: value }))} />)}</div>
  </section>;
}
