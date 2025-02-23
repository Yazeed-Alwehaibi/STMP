import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and anon key
const SUPABASE_URL = 'https://rydjiiowdlvndeqikelf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZGppaW93ZGx2bmRlcWlrZWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMzQ2NDAsImV4cCI6MjA1NTkxMDY0MH0.afyfD01LQBg2jM4SlUuA-2n1UfY9MV3rlynvUtswfpE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
