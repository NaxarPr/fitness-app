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
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('id, exercise_name, user_id, day_number, muscle');

        if (exercisesError) {
          console.error('Error fetching exercises:', exercisesError);
        }

        const exercisesByUser = (exercisesData || []).reduce((acc, exercise) => {
          if (!exercise.user_id) {
            return acc;
          }

          if (!acc[exercise.user_id]) {
            acc[exercise.user_id] = [];
          }

          acc[exercise.user_id].push(exercise);
          return acc;
        }, {});

        const buildProgram = (userExercises = []) => {
          const baseProgram = { 1: [], 2: [], 3: [], 4: [] };

          userExercises.forEach((exercise) => {
            const dayKey = exercise.day_number?.toString();

            if (!dayKey || !baseProgram[dayKey]) {
              return;
            }

            baseProgram[dayKey].push({
              id: exercise.id,
              name: exercise.exercise_name,
              muscle: exercise.muscle,
            });
          });

          return baseProgram;
        };
        
        const usersWithWeight = await Promise.all(usersData.map(async user => {
          const userWeight = weightData.filter(weight => weight.user_id === user.id).pop();
          const userExercises = exercisesByUser[user.id] || [];
          const lastDay = await getLastExercise(user, userExercises);

          return {
            ...user,
            weight: userWeight ? userWeight.weight : null,
            last_day: lastDay,
            program: buildProgram(userExercises),
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