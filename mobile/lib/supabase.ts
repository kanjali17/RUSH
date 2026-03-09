import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vevjlzrvdncxqnjoinhe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldmpsenJ2ZG5jeHFuam9pbmhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MTEwOTMsImV4cCI6MjA4Nzk4NzA5M30.tLP70KiAsY_J43ug2o2FGx39_h29w60EQ345vg72i7s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
