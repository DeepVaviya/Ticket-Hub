import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  setupAdminUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (() => {
        (async () => {
          setUser(session?.user ?? null);
          if (session?.user) {
            await loadProfile(session.user.id);
          } else {
            setProfile(null);
            setLoading(false);
          }
        })();
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (data.user && !error) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          full_name: fullName,
          is_admin: false,
        });

      if (profileError) {
        return { error: profileError };
      }
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const setupAdminUser = async () => {
    const adminEmail = 'admin@ticketbooking.com';
    const adminPassword = 'admin123';
    const adminName = 'System Administrator';

    try {
      // Check if admin user already exists
      const { data: existingAdmin } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', adminEmail)
        .eq('is_admin', true)
        .maybeSingle();

      if (existingAdmin) {
        console.log('Admin user already exists');
        return;
      }

      // Try to sign up the admin user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
      });

      if (authError) {
        // If user already exists, just update their profile to admin
        if (authError.message.includes('already registered')) {
          const { data: existingUser } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', adminEmail)
            .maybeSingle();

          if (existingUser) {
            await supabase
              .from('profiles')
              .update({ is_admin: true, full_name: adminName })
              .eq('id', existingUser.id);
            console.log('Updated existing user to admin');
          }
        } else {
          console.error('Error creating admin user:', authError);
        }
        return;
      }

      if (authData.user) {
        // Create admin profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: adminEmail,
            full_name: adminName,
            is_admin: true,
          });

        if (profileError) {
          console.error('Error creating admin profile:', profileError);
        } else {
          console.log('Admin user created successfully');
        }
      }
    } catch (error) {
      console.error('Error setting up admin user:', error);
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    setupAdminUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
