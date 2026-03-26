import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import { useShallow } from 'zustand/shallow';
import { Loader } from '../components/common/Loader';

const ProtectedLayout = () => {
  const location = useLocation();
  const fetchUsers = useAppStore(useShallow((state) => state.fetchUsers));
  const { session, initializing } = useAuthStore(
    useShallow((state) => ({
      session: state.session,
      initializing: state.initializing,
    }))
  );

  useEffect(() => {
    if (initializing || !session) {
      return;
    }
    fetchUsers();
  }, [fetchUsers, initializing, session]);

  if (initializing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Loader size={100} color="green" />
        <p className="text-white">Loading…</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
