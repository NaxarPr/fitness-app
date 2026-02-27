import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { getLastExercise } from '../utils/getLastExercise';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [column, setColumn] = useState('flex-col');
  const [hideWeights, setHideWeights] = useState(() => {
    const saved = localStorage.getItem('user-hide-weights');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('user-hide-weights', String(hideWeights));
  }, [hideWeights]);

  const handleHideWeights = () => {
    setHideWeights((prev) => !prev);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: usersData } = await supabase.from('users').select('*');
        const { data: weightData } = await supabase.from('weight_logs').select('*');

        const getProgramFromUser = (user) => {
          const raw = user.program;
          if (raw && typeof raw === 'object' && Object.keys(raw).length > 0) {
            return raw;
          }
          return { 1: [], 2: [], 3: [], 4: [] };
        };

        const usersWithWeight = await Promise.all(usersData.map(async (user) => {
          const userWeight = weightData.filter((w) => w.user_id === user.id).pop();
          const program = getProgramFromUser(user);
          const lastDay = await getLastExercise(user, program);

          return {
            ...user,
            weight: userWeight ? userWeight.weight : null,
            last_day: lastDay,
            program,
          };
        }));

        setUsers(usersWithWeight);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const value = {
    users,
    loading,
    column,
    setColumn,
    setUsers,
    handleHideWeights,
    hideWeights
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
} 