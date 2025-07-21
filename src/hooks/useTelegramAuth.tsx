import { useState, useEffect, useCallback } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { supabase } from '@/integrations/supabase/client';

interface TelegramUser {
  id: string;
  telegram_id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  is_premium?: boolean;
}

interface AuthState {
  user: TelegramUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useTelegramAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const authenticate = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Get launch parameters from Telegram
      const launchParams = retrieveLaunchParams();
      const initData = launchParams.initDataRaw;

      if (!initData) {
        throw new Error('No initData available from Telegram');
      }

      console.log('🚀 Starting Telegram authentication with initData');

      // Call our Edge Function to validate initData and get JWT
      const functionUrl = `https://enualwijtpsaurhcdorj.supabase.co/functions/v1/telegram-auth`;
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVudWFsd2lqdHBzYXVyaGNkb3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mjg4MjIsImV4cCI6MjA2ODUwNDgyMn0.MCyFyRTkQmS2yGhjo3XUt-uoW42X73wp05QDKd_R0KQ',
        },
        body: JSON.stringify({ initData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      const authData = await response.json();
      
      // Set the session with Supabase using the JWT
      const { data: session, error: sessionError } = await supabase.auth.setSession({
        access_token: authData.access_token,
        refresh_token: authData.access_token, // Using same token for both
      });

      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`);
      }

      console.log('✅ Telegram authentication successful');

      setAuthState({
        user: authData.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return authData.user;
    } catch (error) {
      console.error('❌ Telegram authentication failed:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      });
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('❌ Sign out failed:', error);
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (session?.user) {
            // Extract user data from JWT payload
            const payload = JSON.parse(atob(session.access_token.split('.')[1]));
            
            setAuthState({
              user: {
                id: session.user.id,
                telegram_id: payload.telegram_id,
                first_name: payload.first_name,
                last_name: payload.last_name,
                username: payload.username,
                photo_url: session.user.user_metadata?.photo_url,
                is_premium: session.user.user_metadata?.is_premium,
              },
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            // No session, try to authenticate with Telegram if available
            try {
              await authenticate();
            } catch (error) {
              console.log('🔐 Auto authentication not available');
              setAuthState(prev => ({ 
                ...prev, 
                isLoading: false,
                error: null // Don't treat this as an error
              }));
            }
          }
        }
      } catch (error) {
        if (mounted) {
          console.log('🔐 No existing session');
          setAuthState(prev => ({ 
            ...prev, 
            isLoading: false,
            error: null // Don't treat this as an error
          }));
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_OUT' || !session) {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } else if (session?.user) {
          const payload = JSON.parse(atob(session.access_token.split('.')[1]));
          
          setAuthState({
            user: {
              id: session.user.id,
              telegram_id: payload.telegram_id,
              first_name: payload.first_name,
              last_name: payload.last_name,
              username: payload.username,
              photo_url: session.user.user_metadata?.photo_url,
              is_premium: session.user.user_metadata?.is_premium,
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        }
      }
    );

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [authenticate]);

  return {
    ...authState,
    authenticate,
    signOut,
  };
};