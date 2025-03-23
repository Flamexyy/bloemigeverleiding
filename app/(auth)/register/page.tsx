'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LuUser } from "react-icons/lu";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
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
          lastName: formData.lastName
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
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  return (
    <div className="w-full max-w-[400px]">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <LuUser className="text-2xl" />
        </div>
        <h1 className="text-3xl font-bold">CREATE ACCOUNT</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-center">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block font-bold">
              FIRST NAME
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="block font-bold">
              LAST NAME
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block font-bold">
            EMAIL
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block font-bold">
            PASSWORD
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block font-bold">
            CONFIRM PASSWORD
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
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
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-500">Already have an account?</p>
        <Link 
          href="/login" 
          className="font-bold hover:opacity-70 transition-opacity"
        >
          Login
        </Link>
      </div>
    </div>
  );
} 