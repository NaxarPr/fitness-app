import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import { useShallow } from 'zustand/shallow';
import { Loader } from '../components/common/Loader';
import { useTrainingStore } from '../store/trainingStore';

const ProtectedLayout = () => {
  const location = useLocation();
  const fetchUsers = useAppStore(useShallow((state) => state.fetchUsers));
  const fetchAllUserExercises = useTrainingStore(useShallow((state) => state.fetchAllUserExercises));
  
  const { session, initializing, userId } = useAuthStore(
    useShallow((state) => ({
      session: state.session,
      initializing: state.initializing,
      userId: state.session?.user?.id,
    }))
  );

  useEffect(() => {
    if (initializing || !userId) {
      return;
    }
    fetchUsers();
    fetchAllUserExercises();
  }, [fetchUsers, fetchAllUserExercises, initializing, userId]);

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
