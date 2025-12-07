"use client";
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createBrowserClient(supabaseUrl, supabaseKey);

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState("Authenticating...");

  useEffect(() => {
    const handleAuth = async () => {
      // 1. Check if session already exists
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setStatus("Session found. Redirecting...");
        await redirectUser(session.user.id);
        return;
      }

      // 2. Listen for auth changes (e.g. PKCE exchange)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setStatus("Signed in. Redirecting...");
          await redirectUser(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setStatus("Signed out. Redirecting to login...");
          router.push('/auth');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    };

    handleAuth();
  }, [router]);

  const redirectUser = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Profile fetch error:", error);
        // Fallback to dashboard if profile fails
        router.push('/dashboard');
        return;
      }

      if (profile?.role === 'doctor') {
        router.push('/doctor');
      } else {
        router.push('/dashboard');
      }
    } catch (e) {
      console.error("Redirect error:", e);
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-black">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">{status}</h2>
        <p className="text-gray-500">Please wait while we log you in.</p>
        <button 
          onClick={() => router.push('/auth')}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Stuck? Return to Login
        </button>
      </div>
    </div>
  );
}
