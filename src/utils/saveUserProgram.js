import { supabase } from '../supabase';
import { normalizeProgramForDb } from './normalizeProgramForDb';

export const saveUserProgram = async ({ user, program }) => {
  if (!user?.id) {
    return {
      success: false,
      error: new Error('User id is required'),
    };
  }

  const payload = normalizeProgramForDb(program);

  const { error } = await supabase
    .from('users')
    .update({ program: payload })
    .eq('id', user.id);

  if (error) {
    return {
      success: false,
      error,
    };
  }

  return {
    success: true,
    error: null,
  };
};
