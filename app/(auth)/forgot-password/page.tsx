'use client';
import { useState } from 'react';
import Link from 'next/link';
import { LuUser } from "react-icons/lu";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setSuccess(true);
      setEmail('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px]">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <LuUser className="text-2xl" />
        </div>
        <h1 className="text-3xl font-bold">FORGOT PASSWORD</h1>
        <p className="text-gray-500 mt-2">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-500 p-3 rounded-xl text-center">
            Reset link has been sent to your email address.
          </div>
        )}
        <div className="space-y-2">
          <label htmlFor="email" className="block font-bold">
            EMAIL
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-xl"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-zinc-900 text-white rounded-xl p-3 hover:bg-zinc-800 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-500">Remember your password?</p>
        <Link 
          href="/login" 
          className="font-bold hover:opacity-70 transition-opacity"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
} 