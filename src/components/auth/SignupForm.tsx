'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/db/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, User, CheckCircle } from 'lucide-react';

const signupSchema = z
  .object({
    fullName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setError(null);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.fullName } },
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  };

  /* ===== Success Screen ===== */
  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 100%)',
        }}
      >
        <div
          className="animate-slide-up glass-card"
          style={{ maxWidth: '440px', width: '100%', padding: '56px 40px', borderRadius: '28px', textAlign: 'center' }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #22d3ee)',
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 30px rgba(16,185,129,0.3)',
            }}
          >
            <CheckCircle style={{ width: '40px', height: '40px', color: 'white' }} />
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
            Check your email! 📬
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(203,213,225,0.6)', marginBottom: '32px', lineHeight: 1.6 }}>
            We&apos;ve sent a confirmation link to your email address. Please verify to get started.
          </p>
          <Link
            href="/login"
            className="btn-gradient"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              borderRadius: '14px',
              fontSize: '15px',
              textDecoration: 'none',
            }}
          >
            Go to Login
            <ArrowRight style={{ width: '18px', height: '18px' }} />
          </Link>
        </div>
      </div>
    );
  }

  /* ===== Main Signup Page ===== */
  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 100%)',
      }}
    >
      {/* ===== Animated BG Elements ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="animate-float"
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-5%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="animate-float-delayed"
          style={{
            position: 'absolute',
            bottom: '-15%',
            right: '-10%',
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="animate-pulse-glow"
          style={{
            position: 'absolute',
            top: '50%',
            right: '25%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Grid overlay */}
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

      {/* ===== LEFT SIDE — Branding ===== */}
      <div className="hidden lg:flex lg:w-[50%] relative z-10 items-center justify-center p-16">
        <div className="max-w-lg">
          <div className="animate-slide-up flex items-center gap-4 mb-12">
            <div
              className="glass"
              style={{ width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Sparkles style={{ width: '32px', height: '32px', color: '#22d3ee' }} />
            </div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #22d3ee 0%, #a78bfa 50%, #f472b6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Finance Buddy
            </h1>
          </div>

          <div className="animate-slide-up-delay-1">
            <h2
              style={{
                fontSize: '50px',
                fontWeight: 800,
                lineHeight: 1.1,
                color: 'white',
                marginBottom: '24px',
              }}
            >
              Start your{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #22d3ee, #a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                financial
              </span>
              <br />
              journey today
            </h2>
            <p style={{ fontSize: '18px', color: 'rgba(203,213,225,0.8)', lineHeight: 1.7, maxWidth: '420px' }}>
              Join thousands of smart savers who trust Finance Buddy to manage their money effectively.
            </p>
          </div>

          {/* Stats */}
          <div
            className="animate-slide-up-delay-2"
            style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}
          >
            {[
              { value: '50K+', label: 'Users', icon: '👥' },
              { value: '₹10Cr+', label: 'Tracked', icon: '💰' },
              { value: '4.9★', label: 'Rating', icon: '⭐' },
            ].map((stat, i) => (
              <div
                key={i}
                className="glass"
                style={{
                  textAlign: 'center',
                  padding: '20px 12px',
                  borderRadius: '16px',
                }}
              >
                <span style={{ fontSize: '28px' }}>{stat.icon}</span>
                <p
                  style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: 'white',
                    marginTop: '8px',
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(203,213,225,0.5)', marginTop: '4px' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== RIGHT SIDE — Signup Form ===== */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-6">
        <div
          className="animate-slide-up w-full glass-card"
          style={{ maxWidth: '440px', padding: '40px', borderRadius: '28px' }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '28px' }}>
            <div
              className="glass"
              style={{ width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Sparkles style={{ width: '24px', height: '24px', color: '#22d3ee' }} />
            </div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #22d3ee, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Finance Buddy
            </h1>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
              Create account 🚀
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(203,213,225,0.6)' }}>
              Get started for free — no credit card needed
            </p>
          </div>

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
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(203,213,225,0.8)', marginBottom: '8px' }}>
                Full name
              </label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: 'rgba(34,211,238,0.6)' }} />
                <input
                  id="full-name"
                  {...register('fullName')}
                  type="text"
                  autoComplete="name"
                  className="glass-input"
                  style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '14px', fontSize: '15px' }}
                  placeholder="Your full name"
                />
              </div>
              {errors.fullName && (
                <p style={{ color: '#fca5a5', fontSize: '12px', marginTop: '6px', paddingLeft: '4px' }}>{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(203,213,225,0.8)', marginBottom: '8px' }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: 'rgba(34,211,238,0.6)' }} />
                <input
                  id="email-address-signup"
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="glass-input"
                  style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '14px', fontSize: '15px' }}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p style={{ color: '#fca5a5', fontSize: '12px', marginTop: '6px', paddingLeft: '4px' }}>{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(203,213,225,0.8)', marginBottom: '8px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: 'rgba(34,211,238,0.6)' }} />
                <input
                  id="password-for-signup"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  autoComplete="new-password"
                  className="glass-input"
                  style={{ width: '100%', padding: '14px 48px 14px 48px', borderRadius: '14px', fontSize: '15px' }}
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'rgba(34,211,238,0.6)' }}
                >
                  {showPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: '#fca5a5', fontSize: '12px', marginTop: '6px', paddingLeft: '4px' }}>{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(203,213,225,0.8)', marginBottom: '8px' }}>
                Confirm password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: 'rgba(34,211,238,0.6)' }} />
                <input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  autoComplete="new-password"
                  className="glass-input"
                  style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '14px', fontSize: '15px' }}
                  placeholder="Repeat your password"
                />
              </div>
              {errors.confirmPassword && (
                <p style={{ color: '#fca5a5', fontSize: '12px', marginTop: '6px', paddingLeft: '4px' }}>{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gradient"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '4px',
              }}
            >
              {isSubmitting ? (
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
              ) : (
                <>
                  Create account
                  <ArrowRight style={{ width: '18px', height: '18px' }} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: '12px', color: 'rgba(203,213,225,0.4)', textTransform: 'uppercase', letterSpacing: '2px' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(203,213,225,0.6)' }}>
            Already have an account?{' '}
            <Link
              href="/login"
              style={{
                fontWeight: 600,
                background: 'linear-gradient(135deg, #22d3ee, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textDecoration: 'none',
              }}
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
