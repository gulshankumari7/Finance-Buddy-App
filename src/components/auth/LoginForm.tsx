'use client';

import { supabase } from '@/lib/db/supabase';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, TrendingUp, Shield, Zap, PieChart, Wallet } from 'lucide-react';

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // On mount: check if user is already logged in or if tokens are in the URL hash
  useEffect(() => {
    // Listen for auth state changes (handles the implicit flow hash tokens)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard');
      }
    });

    // Also check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard');
      } else {
        setCheckingSession(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/login`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Show a loading state while checking session
  if (checkingSession) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 100%)',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(139,92,246,0.2)',
            borderTopColor: '#a78bfa',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 100%)',
      }}
    >
      {/* ===== Animated Background ===== */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div
          className="animate-float"
          style={{
            position: 'absolute',
            top: '-8%',
            right: '-3%',
            width: '650px',
            height: '650px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="animate-float-delayed"
          style={{
            position: 'absolute',
            bottom: '-12%',
            left: '-8%',
            width: '750px',
            height: '750px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="animate-pulse-glow"
          style={{
            position: 'absolute',
            top: '35%',
            left: '25%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="animate-float"
            style={{
              position: 'absolute',
              top: `${10 + i * 12}%`,
              left: `${8 + i * 10}%`,
              width: `${3 + (i % 3) * 2}px`,
              height: `${3 + (i % 3) * 2}px`,
              borderRadius: '50%',
              background: `rgba(${139 + i * 15}, ${92 + i * 20}, 246, ${0.25 + (i % 4) * 0.1})`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${6 + i * 1.5}s`,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ===== LEFT PANEL ===== */}
      <div
        className="hidden lg:flex"
        style={{
          width: '55%',
          position: 'relative',
          zIndex: 10,
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px',
        }}
      >
        <div style={{ maxWidth: '520px' }}>
          <div className="animate-slide-up" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '56px' }}>
            <div
              className="glass"
              style={{ width: '64px', height: '64px', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Sparkles style={{ width: '34px', height: '34px', color: '#c084fc' }} />
            </div>
            <h1
              style={{
                fontSize: '36px',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 50%, #fb923c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}
            >
              Finance Buddy
            </h1>
          </div>

          <div className="animate-slide-up-delay-1">
            <h2
              style={{
                fontSize: '54px',
                fontWeight: 800,
                lineHeight: 1.08,
                color: 'white',
                marginBottom: '24px',
                letterSpacing: '-1px',
              }}
            >
              Your money,{' '}
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #a78bfa, #f472b6, #fb923c)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                simplified
              </span>
            </h2>
            <p style={{ fontSize: '18px', color: 'rgba(203,213,225,0.75)', lineHeight: 1.7, maxWidth: '440px' }}>
              Track expenses, set budgets, and unlock AI-powered insights to grow your wealth — all in one beautiful dashboard.
            </p>
          </div>

          <div
            className="animate-slide-up-delay-2"
            style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}
          >
            {[
              { icon: TrendingUp, label: 'Smart Analytics', color: '#a78bfa' },
              { icon: Zap, label: 'AI Predictions', color: '#f472b6' },
              { icon: PieChart, label: 'Budget Tracking', color: '#22d3ee' },
              { icon: Shield, label: 'Secure & Private', color: '#34d399' },
              { icon: Wallet, label: 'Multi-Category', color: '#fbbf24' },
              { icon: Sparkles, label: 'Beautiful UI', color: '#f472b6' },
            ].map((feat, i) => (
              <div
                key={i}
                className="glass"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  transition: 'transform 0.3s ease, background 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                }}
              >
                <feat.icon style={{ width: '20px', height: '20px', color: feat.color, flexShrink: 0 }} />
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>{feat.label}</span>
              </div>
            ))}
          </div>

          <div className="animate-slide-up-delay-3" style={{ marginTop: '48px', display: 'flex', gap: '40px' }}>
            {[
              { value: '50K+', label: 'Users' },
              { value: '₹10Cr+', label: 'Tracked' },
              { value: '4.9★', label: 'Rating' },
            ].map((stat, i) => (
              <div key={i}>
                <p
                  style={{
                    fontSize: '30px',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #c084fc, #f472b6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ fontSize: '13px', color: 'rgba(203,213,225,0.5)', marginTop: '4px' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL — Google Sign In ===== */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10,
          padding: '24px',
        }}
      >
        <div
          className="animate-slide-up glass-card"
          style={{ width: '100%', maxWidth: '420px', padding: '52px 44px', borderRadius: '32px' }}
        >
          {/* Mobile Logo */}
          <div
            className="lg:hidden"
            style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}
          >
            <div
              className="glass"
              style={{ width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Sparkles style={{ width: '26px', height: '26px', color: '#c084fc' }} />
            </div>
            <h1
              style={{
                fontSize: '26px',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #c084fc, #f472b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Finance Buddy
            </h1>
          </div>

          {/* Icon + Heading */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.3))',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <Wallet style={{ width: '36px', height: '36px', color: '#c084fc' }} />
            </div>
            <h2 style={{ fontSize: '30px', fontWeight: 700, color: 'white', marginBottom: '10px' }}>
              Built by Gulshan and team ✨
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(203,213,225,0.6)', lineHeight: 1.6 }}>
              Sign in to manage your finances
              <br />
              with AI-powered insights
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                marginBottom: '20px',
                padding: '14px 18px',
                borderRadius: '14px',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5',
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px 24px',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: 600,
              background: 'white',
              color: '#1f2937',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.05)',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.05)';
            }}
          >
            {loading ? (
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  border: '2.5px solid #e5e7eb',
                  borderTopColor: '#6366f1',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
            ) : (
              <>
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Trust badges */}
          <div style={{ marginTop: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: '12px', color: 'rgba(203,213,225,0.35)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                secure login
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
              {[
                { icon: Shield, text: 'Encrypted' },
                { icon: Zap, text: 'Instant' },
                { icon: Sparkles, text: 'Free' },
              ].map((badge, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <badge.icon style={{ width: '14px', height: '14px', color: 'rgba(167,139,250,0.6)' }} />
                  <span style={{ fontSize: '12px', color: 'rgba(203,213,225,0.45)' }}>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(203,213,225,0.35)', marginTop: '28px', lineHeight: 1.6 }}>
            By signing in, you agree to our{' '}
            <Link href="#" style={{ color: 'rgba(167,139,250,0.7)', textDecoration: 'none' }}>Terms</Link>{' '}
            &{' '}
            <Link href="#" style={{ color: 'rgba(167,139,250,0.7)', textDecoration: 'none' }}>Privacy Policy</Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LoginForm;
