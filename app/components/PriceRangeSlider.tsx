'use client';
import { useState, useEffect } from 'react';

interface PriceRangeSliderProps {
  onPriceChange?: (value: number) => void;
  min?: number;
  max?: number;
  initialValue?: number;
  onReset?: () => void;
}

export default function PriceRangeSlider({ 
  min = 0, 
  max = 500, 
  initialValue,
  onPriceChange,
  onReset
}: PriceRangeSliderProps) {
  const [priceRange, setPriceRange] = useState(initialValue || max / 2);

  useEffect(() => {
    if (initialValue !== undefined) {
      setPriceRange(initialValue);
    }
  }, [initialValue]);

  const formatPrice = (price: number) => {
    return price === max ? `€${price}+` : `€${price}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPriceRange(value);
    onPriceChange?.(value);
  };

  const percentage = ((priceRange - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex justify-between">
        <label htmlFor="price-range" className="text-sm text-gray-600">
          Price Range
        </label>
        <span className="text-sm font-medium">
          {formatPrice(priceRange)}
        </span>
      </div>

      <div className="relative mt-2">
        {/* Track background */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-gray-200 rounded-lg" />
        {/* Filled track */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 h-2 bg-zinc-600 rounded-lg" 
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          id="price-range"
          min={min}
          max={max}
          value={priceRange}
          onChange={handleChange}
          className="relative w-full h-2 bg-transparent appearance-none cursor-pointer z-10
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:mt-[-1px]
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-zinc-600
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:hover:bg-zinc-700
            [&::-webkit-slider-thumb]:transition-colors
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:mt-[-1px]
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-zinc-600
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-white
            [&::-moz-range-thumb]:hover:bg-zinc-700
            [&::-moz-range-thumb]:transition-colors"
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>€{min}</span>
        <span>€{max}+</span>
      </div>
    </div>
  );
} 