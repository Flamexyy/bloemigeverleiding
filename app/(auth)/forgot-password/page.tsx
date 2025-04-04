'use client';
import { useState } from 'react';
import Link from 'next/link';
import { LuUser } from "react-icons/lu";
import { IoArrowBack } from "react-icons/io5";

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
        throw new Error(data.message || 'Kon geen reset link versturen');
      }

      setSuccess(true);
      setEmail('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Kon geen reset link versturen');
    } finally {
      setIsLoading(false);
    }
  };

  // Add this function to validate email
  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  return (
    <div className="w-full max-w-[400px] text-text">
      <Link 
        href="/"
        className="inline-flex items-center gap-2 text-text/70 hover:text-text mb-8"
      >
        <IoArrowBack />
        Terug naar de webshop
      </Link>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <LuUser className="text-2xl text-text" />
        </div>
        <h1 className="text-3xl font-bold">WACHTWOORD VERGETEN</h1>
        <p className="text-text/70 mt-2">
          Vul je e-mailadres in en we sturen je een link om je wachtwoord te resetten.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-400 p-3 rounded-xl text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-500 p-3 rounded-xl text-center">
            Reset link is verstuurd naar je e-mailadres.
          </div>
        )}
        <div className="space-y-2">
          <label htmlFor="email" className="block font-bold text-text">
            E-MAILADRES
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-3 border border-text/20 rounded-xl text-text focus:outline-none focus:border-text
              ${email && isValidEmail(email) ? 'valid-input' : ''}
            `}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-accent text-text rounded-[25px] p-3 hover:bg-accent/70 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Link versturen...' : 'Verstuur reset link'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-text/70">Wachtwoord herinnerd?</p>
        <Link 
          href="/login" 
          className="font-bold text-text hover:opacity-70 transition-opacity"
        >
          Terug naar inloggen
        </Link>
      </div>
    </div>
  );
} 