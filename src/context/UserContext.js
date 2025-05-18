import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { getLastExercise } from '../utils/getLastExercise';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: usersData } = await supabase.from('users').select('*');
        const { data: weightData } = await supabase.from('weight_logs').select('*');
        
        const usersWithWeight = await Promise.all(usersData.map(async user => {
          const userWeight = weightData.filter(weight => weight.user_id === user.id).pop();
          const lastDay = await getLastExercise(user);
          
          return {
            ...user,
            weight: userWeight ? userWeight.weight : null,
            last_day: lastDay
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
    setUsers
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