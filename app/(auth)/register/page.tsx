'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LuUser } from "react-icons/lu";
import { IoArrowBack } from "react-icons/io5";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptsMarketing: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          acceptsMarketing: formData.acceptsMarketing
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      router.push('/login');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
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
        <h1 className="text-3xl font-bold">ACCOUNT AANMAKEN</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-400 p-3 rounded-xl text-center">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block font-bold text-text">
              VOORNAAM
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 border border-text/20 rounded-xl text-text focus:outline-none focus:border-text"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="block font-bold text-text">
              ACHTERNAAM
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 border border-text/20 rounded-xl text-text focus:outline-none focus:border-text"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block font-bold text-text">
            E-MAILADRES
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-text/20 rounded-xl text-text focus:outline-none focus:border-text"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block font-bold text-text">
            WACHTWOORD
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-text/20 rounded-xl text-text focus:outline-none focus:border-text"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block font-bold text-text">
            BEVESTIG WACHTWOORD
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border border-text/20 rounded-xl text-text focus:outline-none focus:border-text"
            required
          />
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="acceptsMarketing"
            name="acceptsMarketing"
            checked={formData.acceptsMarketing}
            onChange={handleChange}
            className="h-4 w-4 text-accent border-text/20 rounded focus:ring-accent"
          />
          <label htmlFor="acceptsMarketing" className="ml-2 block text-sm text-text">
            Schrijf me in voor de nieuwsbrief
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-accent text-text rounded-[25px] p-3 hover:bg-accent/70 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Account aanmaken...' : 'Account aanmaken'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-text/70">Heb je al een account?</p>
        <Link 
          href="/login" 
          className="font-bold text-text hover:opacity-70 transition-opacity"
        >
          Inloggen
        </Link>
      </div>
    </div>
  );
} 