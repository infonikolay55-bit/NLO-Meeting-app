import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import SettingsMenu from './SettingsMenu';
import SettingsProfileCard from './SettingsProfileCard';
import ProfilePanel from './ProfilePanel';
import BookingRulesPanel from './BookingRulesPanel';
import RoomsPanel from './RoomsPanel';
import ApprovalsPanel from './ApprovalsPanel';
import CalendarIntegrationsPanel from './CalendarIntegrationsPanel';
import AccessRolesPanel from './AccessRolesPanel';
import NotificationsPanel from './NotificationsPanel';
import MeetingRecordsPanel from './MeetingRecordsPanel';

const panels = {
  profile: ProfilePanel,
  'booking-rules': BookingRulesPanel,
  rooms: RoomsPanel,
  approvals: ApprovalsPanel,
  calendar: CalendarIntegrationsPanel,
  'access-roles': AccessRolesPanel,
  notifications: NotificationsPanel,
  records: MeetingRecordsPanel,
};

export default function Settings({ currentUser }) {
  const [activePanel, setActivePanel] = useState('profile');
  const { profileImage, setProfileImage } = useOutletContext();
  const user = Array.isArray(currentUser) ? currentUser[0] : currentUser;
  const isAdmin = user?.role === 'admin';
  const ActivePanel = panels[activePanel] || ProfilePanel;
  const panelProps = activePanel === 'profile'
    ? { user, isAdmin, profileImage, setProfileImage }
    : { user, isAdmin };

  return (
    <div className="-m-8 min-h-full bg-[#F8FAFC] px-8 py-7 max-md:px-4 max-md:py-5">
      <div className="mx-auto w-full max-w-6xl pb-24 md:pb-8">
        <header className="mb-6">
          <p className="mb-1 text-sm font-semibold text-[#564BFF]">Workspace</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[30px]">Settings</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">Manage your account and meeting workspace preferences.</p>
        </header>
        <SettingsProfileCard user={user} profileImage={profileImage || user?.image} onClick={() => setActivePanel('profile')} />
        <div className="mt-5 grid min-w-0 gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
          <SettingsMenu activePanel={activePanel} isAdmin={isAdmin} onSelect={setActivePanel} />
          <ActivePanel {...panelProps} />
        </div>
      </div>
    </div>
  );
}
