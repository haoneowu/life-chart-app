import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://rmkbzzeudbuarfkzpsih.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseKey) {
    console.warn('API: Supabase Anon Key is missing.');
}

export const supabase = createClient(supabaseUrl, supabaseKey || 'missing_key');
