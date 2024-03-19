import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

export const supabaseUrl = 'https://ehagbayijceqwdymykyi.supabase.co';
export const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoYWdiYXlpamNlcXdkeW15a3lpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MzI5MDMxNiwiZXhwIjoxOTk4ODY2MzE2fQ.f5HLCE5Ajiy-KX5AuNOnar2S99jMiFdjKwfbGpvUiXE';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export function supabaseDynamic(supabaseUrlKey: string, supabaseKeys: string) {
  const supabaseNew = createClient(supabaseUrlKey, supabaseKeys, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  return supabaseNew;
}
