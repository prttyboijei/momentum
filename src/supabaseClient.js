import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://czijekswoeeedchrotuf.supabase.co"
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "YOeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6aWpla3N3b2VlZWRjaHJvdHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDU0OTYsImV4cCI6MjA5MDQ4MTQ5Nn0.S_DDIKF95mZpQOl7D6I8t4NtGVf-7fLDs8TKPxfoOzE"

export const supabase = createClient(supabaseUrl, supabaseKey)  