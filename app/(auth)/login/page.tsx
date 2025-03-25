'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LuUser } from "react-icons/lu";
import { useAuth } from '../../context/AuthContext';
import { IoArrowBack } from "react-icons/io5";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      router.push('/profile');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
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
        <h1 className="text-3xl font-bold">INLOGGEN</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-400 p-3 rounded-xl text-center">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label htmlFor="email" className="block font-bold text-text">
            E-MAILADRES
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-text/20 rounded-xl text-text focus:outline-none focus:border-text"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block font-bold text-text">
              WACHTWOORD
            </label>
            <Link 
              href="/forgot-password" 
              className="text-sm text-text/70 hover:text-text"
            >
              Wachtwoord vergeten?
            </Link>
          </div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-text/20 rounded-xl text-text focus:outline-none focus:border-text"
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
          {isLoading ? 'Even geduld...' : 'Inloggen'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-text/70">Nog geen account?</p>
        <Link 
          href="/register" 
          className="font-bold text-text hover:opacity-70 transition-opacity"
        >
          Account aanmaken
        </Link>
      </div>
    </div>
  );
} 