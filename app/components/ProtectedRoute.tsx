'use client';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="max-w-[1600px] mx-auto p-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side Skeleton */}
          <div className="lg:w-[300px]">
            <div className="space-y-6">
              {/* Profile Header Skeleton */}
              <div className="flex items-center gap-4 mb-4">
                <div className="min-w-16 h-16 bg-accent/30 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-6 bg-accent/30 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-accent/30 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>

              {/* Navigation Skeleton */}
              <div className="space-y-2">
                <div className="h-14 bg-accent/30 rounded-xl animate-pulse"></div>
                <div className="h-14 bg-accent/30 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Right Side Skeleton */}
          <div className="flex-1">
            <div className="space-y-6">
              <div className="h-10 bg-accent/30 rounded w-1/3 animate-pulse"></div>
              <div className="h-40 bg-accent/30 rounded-2xl animate-pulse"></div>
              <div className="h-40 bg-accent/30 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
} 