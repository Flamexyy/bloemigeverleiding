'use client';
import { useState } from 'react';
import Image from 'next/image';

interface FadeInImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export default function FadeInImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  priority = false 
}: FadeInImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={`transition-opacity duration-300 ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-accent/30 animate-pulse rounded-[25px]"
          style={{ width, height }}
        />
      )}
    </div>
  );
} 