import { supabase } from '../lib/supabaseClient';

export async function testSupabase() {
  const { data, error } = await supabase.from('gym').select('*');

  if (error) {
    console.error(error);
    return 'Supabase error ❌';
  }

  console.log('Supabase data: adsf', data);
  return 'Supabase working ✅';
}
