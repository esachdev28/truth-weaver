import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                toast({
                    title: "Signup Failed",
                    description: error.message,
                    variant: "destructive",
                });
                return { error };
            }

            toast({
                title: "Success!",
                description: "Account created successfully. Please check your email to verify your account.",
            });

            return { error: null };
        } catch (error) {
            const authError = error as AuthError;
            toast({
                title: "Error",
                description: authError.message,
                variant: "destructive",
            });
            return { error: authError };
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast({
                    title: "Login Failed",
                    description: error.message,
                    variant: "destructive",
                });
                return { error };
            }

            toast({
                title: "Welcome back!",
                description: "You've successfully logged in.",
            });

            return { error: null };
        } catch (error) {
            const authError = error as AuthError;
            toast({
                title: "Error",
                description: authError.message,
                variant: "destructive",
            });
            return { error: authError };
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "Logged out",
                description: "You've been successfully logged out.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to log out. Please try again.",
                variant: "destructive",
            });
        }
    };

    const resetPassword = async (email: string) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
                return { error };
            }

            toast({
                title: "Check your email",
                description: "We've sent you a password reset link.",
            });

            return { error: null };
        } catch (error) {
            const authError = error as AuthError;
            toast({
                title: "Error",
                description: authError.message,
                variant: "destructive",
            });
            return { error: authError };
        }
    };

    const value = {
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
