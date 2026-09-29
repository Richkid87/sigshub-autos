const { createClient } = require('@supabase/supabase-js');

// Hostinger sets SUPABASE_URL and SUPABASE_API_KEY automatically,
// while local Next.js development uses NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

async function getData() {
  if (!supabase) {
    console.warn('[db.js] Supabase environment variables not set.');
    return null;
  }

  // Uses 'cars' table from your Supabase project
  const { data, error } = await supabase
    .from('cars')
    .select('*');

  if (error) {
    console.error('[db.js] Error fetching data:', error.message);
    return null;
  }

  console.log('[db.js] Supabase connected successfully. Rows retrieved:', data?.length ?? 0);
  return data;
}

if (require.main === module) {
  getData();
}

module.exports = { supabase, getData };
