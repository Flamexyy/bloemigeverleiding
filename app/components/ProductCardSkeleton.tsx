import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-[25px] overflow-hidden bg-white border border-text/10 animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-square w-full bg-gray-200 relative"></div>
      
      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Title placeholder */}
        <div className="h-5 bg-gray-200 rounded-full w-3/4"></div>
        
        {/* Price placeholder */}
        <div className="h-6 bg-gray-200 rounded-full w-1/3"></div>
        
        {/* Button placeholder */}
        <div className="h-10 bg-gray-200 rounded-full w-full mt-4"></div>
      </div>
    </div>
  );
} 