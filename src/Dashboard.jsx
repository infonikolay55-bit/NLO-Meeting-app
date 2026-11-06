import React, { useState, useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { clearAuthSession, isAccessTokenValid } from './utils/auth';

export default function Dashboard({ currentUser }) {
  const location = useLocation();
  const [user, setUser] = useState(() => {
    let rawUser = currentUser || location.state?.user || null;
    if (Array.isArray(rawUser)) {
      rawUser = rawUser[0] || null;
    }
    return rawUser;
  });
  const hasValidToken = isAccessTokenValid(localStorage.getItem('access_token'));

  useEffect(() => {
    if (!hasValidToken) clearAuthSession();
  }, [hasValidToken]);

  useEffect(() => {
    if (hasValidToken && currentUser) {
      let normalizedUser = currentUser;
      if (Array.isArray(normalizedUser)) {
        normalizedUser = normalizedUser[0] || null;
      }
      setUser(normalizedUser);
    }
  }, [currentUser, hasValidToken]);

  const [profileImage, setProfileImage] = useState(() => {
    if (user?.image) return user.image;
    return null;
  });

  if (!hasValidToken) return <Navigate to="/" replace state={{ from: location }} />;

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-800 overflow-hidden">
      <Sidebar user={user} profileImage={profileImage} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header user={user} profileImage={profileImage} setProfileImage={setProfileImage} />

        <div className="flex-1 overflow-auto p-8 custom-scrollbar">
          <Outlet context={{ profileImage, setProfileImage }} />
        </div>
      </main>
    </div>
  );
}
