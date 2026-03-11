import { create } from 'zustand';
import { supabase } from '../supabase';
import { getLastExercise } from '../utils/getLastExercise';

const getInitialHideWeights = () => {
  const saved = localStorage.getItem('user-hide-weights');
  return saved === 'true';
};

export const useAppStore = create((set, get) => ({
  users: [],
  setUsers: (users) => {
    if (typeof users === 'function') {
      set((state) => ({ users: users(state.users) }));
    } else {
      set({ users });
    }
  },

  loading: true,

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const { data: usersData } = await supabase.from('users').select('*');
      const { data: weightData } = await supabase.from('weight_logs').select('*');

      if (!usersData || !weightData) {
        set({ users: [] });
        return;
      }

      const getProgramFromUser = (user) => {
        const raw = user.program;
        if (raw && typeof raw === 'object' && Object.keys(raw).length > 0) {
          return raw;
        }
        return { 1: [], 2: [], 3: [], 4: [] };
      };

      const usersWithWeight = await Promise.all(
        usersData.map(async (user) => {
          const userWeight = weightData.filter((w) => w.user_id === user.id).pop();
          const program = getProgramFromUser(user);
          const lastDay = await getLastExercise(user, program);

          return {
            ...user,
            weight: userWeight ? userWeight.weight : null,
            last_day: lastDay,
            program,
          };
        })
      );

      set({ users: usersWithWeight });
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      set({ loading: false });
    }
  },

  startTrainingTime: null,
  setStartTrainingTime: (startTrainingTime) => {
    set({ startTrainingTime });
  },

  column: 'flex-col',
  setColumn: (column) => {
    set({ column });
  },

  hideWeights: getInitialHideWeights(),

  handleHideWeights: () => {
    set((state) => {
      const newHideWeights = !state.hideWeights;
      localStorage.setItem('user-hide-weights', String(newHideWeights));
      return { hideWeights: newHideWeights };
    });
  },
}));
