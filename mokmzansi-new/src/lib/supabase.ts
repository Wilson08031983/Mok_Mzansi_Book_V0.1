import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hayvticreivdsobncgtp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhheXZ0aWNyZWl2ZHNvYm5jZ3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxOTg2NDAsImV4cCI6MjA2Mjc3NDY0MH0.HgRRmF-VWnOIfatz5qeKuAE5sCZO8xZx1KupaA1xd2E';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  },
  
  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  
  // Sign out
  signOut: async () => {
    return await supabase.auth.signOut();
  },
  
  // Get current user
  getCurrentUser: async () => {
    return await supabase.auth.getUser();
  },
  
  // Reset password
  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email);
  }
};

// Database API
export const db = {
  // Clients
  clients: {
    getAll: async () => {
      return await supabase.from('clients').select('*');
    },
    getById: async (id: string) => {
      return await supabase.from('clients').select('*').eq('id', id).single();
    },
    create: async (data: any) => {
      return await supabase.from('clients').insert([data]);
    },
    update: async (id: string, data: any) => {
      return await supabase.from('clients').update(data).eq('id', id);
    },
    delete: async (id: string) => {
      return await supabase.from('clients').delete().eq('id', id);
    },
  },
  
  // Invoices
  invoices: {
    getAll: async () => {
      return await supabase.from('invoices').select('*');
    },
    getById: async (id: string) => {
      return await supabase.from('invoices').select('*').eq('id', id).single();
    },
    create: async (data: any) => {
      return await supabase.from('invoices').insert([data]);
    },
    update: async (id: string, data: any) => {
      return await supabase.from('invoices').update(data).eq('id', id);
    },
    delete: async (id: string) => {
      return await supabase.from('invoices').delete().eq('id', id);
    },
  },
  
  // Add more database operations as needed
};
