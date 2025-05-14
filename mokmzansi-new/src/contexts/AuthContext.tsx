import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, supabase } from '../lib/supabase';

// Define the context type
type AuthContextType = {
  user: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for authenticated user on component mount
    const checkUser = async () => {
      const { data, error } = await auth.getCurrentUser();
      
      if (data && data.user) {
        setUser(data.user);
      }
      
      setLoading(false);
    };
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    checkUser();
    
    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Define authentication methods
  const signIn = async (email: string, password: string) => {
    return await auth.signIn(email, password);
  };

  const signUp = async (email: string, password: string) => {
    return await auth.signUp(email, password);
  };

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    return await auth.resetPassword(email);
  };

  // Expose context value
  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
