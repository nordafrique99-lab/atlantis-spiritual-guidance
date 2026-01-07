// Supabase configuration - Make sure to use YOUR actual Supabase URL and key
const SUPABASE_URL = 'https://revdnghkdjfxuxiqjddk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJldmRuZ2hrZGpmeHV4aXFqZGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NjkzMTcsImV4cCI6MjA4MzM0NTMxN30.ytyzor-EvXbZ67NkC_o9Jaj5CH4dk3iVqxM411Xf5X4';

// Check if Supabase is already loaded
if (!window.supabaseClient) {
    // Initialize Supabase client
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Test connection
    async function testSupabaseConnection() {
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Supabase connection error:', error);
                return false;
            }
            console.log('Supabase connected successfully');
            return true;
        } catch (error) {
            console.error('Supabase connection failed:', error);
            return false;
        }
    }
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', () => {
        testSupabaseConnection();
    });
    
    // Export supabase client
    window.supabaseClient = supabase;
    console.log('Supabase client initialized');
}

// Global access
const supabase = window.supabaseClient;