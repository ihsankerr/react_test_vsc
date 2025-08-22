// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://owncmkmuavulagvoozkk.supabase.co'; // replace with your actual URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93bmNta211YXZ1bGFndm9vemtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTU1MjksImV4cCI6MjA3MTQzMTUyOX0.YGIGTFSaTWJTC7iMM5h6YeOgi63DKJni9j4mNfaNFqI'; // replace with your actual anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);