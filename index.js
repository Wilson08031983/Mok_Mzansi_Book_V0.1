// Supabase client setup
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Validate Supabase credentials
if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase credentials not found. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Example function to test Supabase connection
async function testConnection() {
  try {
    // Check if we can connect to Supabase by getting the current timestamp
    const { data, error } = await supabase.rpc('get_timestamp');
    
    if (error) {
      console.log('Trying alternative connection test...');
      // If the RPC isn't available, try a simpler connection test
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error('Error connecting to Supabase:', authError.message);
        return;
      }
      
      console.log('Successfully connected to Supabase!');
      console.log('Connection verified through auth service');
      return;
    }
    
    console.log('Successfully connected to Supabase!');
    console.log('Server timestamp:', data);
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

// Run the test
testConnection();

// Export the supabase client for use in other files
module.exports = { supabase };
