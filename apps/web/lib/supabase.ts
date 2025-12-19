import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rmkbzzeudbuarfkzpsih.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey) {
    console.warn('Supabase Anon Key is missing. Login might not work. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'missing_key');
