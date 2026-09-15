const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL yoki SUPABASE_KEY .env faylida topilmadi!");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;