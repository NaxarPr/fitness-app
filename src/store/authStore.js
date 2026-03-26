import { create } from 'zustand';
import { supabase } from '../supabase';

let authListenerAttached = false;

export const useAuthStore = create((set) => ({
  session: null,
  initializing: true,

  applySession: (session) => set({ session }),

  initAuth: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, initializing: false });

    if (!authListenerAttached) {
      authListenerAttached = true;
      supabase.auth.onAuthStateChange((_event, nextSession) => {
        set({ session: nextSession });
      });
    }
  },
}));
