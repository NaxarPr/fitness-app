import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ?? 'https://laehhozcrfpokfnpuxhe.supabase.co';
const supabaseAnonKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhZWhob3pjcmZwb2tmbnB1eGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MDkwMTQsImV4cCI6MjA2MjI4NTAxNH0.TvXiZBz1LBMl21X0vQRR2h9kSM6D8RsK-i3UldwR6a0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
