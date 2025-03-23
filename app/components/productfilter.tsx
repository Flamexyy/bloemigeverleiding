'use client';
import { useState, useEffect } from 'react';
import PriceRangeSlider from './PriceRangeSlider';
import { BiChevronDown } from "react-icons/bi";

interface ProductFilterProps {
  onPriceFilter?: (value: string[]) => void;
  onSortChange?: (sort: string) => void;
  initialPrice?: number;
  isMobile?: boolean;
  onReset?: () => void;
  shouldReset?: boolean;
}

export default function ProductFilter({ 
  onPriceFilter,
  onSortChange,
  initialPrice = 250,
  isMobile = false,
  onReset,
  shouldReset = false
}: ProductFilterProps) {
  const [selectedSort, setSelectedSort] = useState<string>('featured');
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState({
    sort: true,
    price: true
  });

  // Reset when shouldReset changes to true
  useEffect(() => {
    if (shouldReset) {
      setSelectedSort('featured');
      setSelectedPrices([]);
    }
  }, [shouldReset]);

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' }
  ];

  const priceRanges = [
    { value: '0-50', label: '€0 - €50' },
    { value: '50-100', label: '€50 - €100' },
    { value: '100-150', label: '€100 - €150' },
    { value: '150+', label: '€150+' }
  ];

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    if (onSortChange) {
      onSortChange(sort);
    }
  };

  const handlePriceChange = (value: string) => {
    const newPrices = selectedPrices.includes(value)
      ? selectedPrices.filter(p => p !== value)
      : [...selectedPrices, value];
    
    setSelectedPrices(newPrices);
    if (onPriceFilter) {
      onPriceFilter(newPrices);
    }
  };

  const handleReset = () => {
    setSelectedSort('featured');
    setSelectedPrices([]);
    setIsExpanded({
      sort: true,
      price: true
    });

    if (onSortChange) {
      onSortChange('featured');
    }
    if (onPriceFilter) {
      onPriceFilter([]);
    }
    if (onReset) {
      onReset();
    }
  };

  const toggleSection = (section: 'sort' | 'price') => {
    setIsExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className={`${isMobile ? 'space-y-6' : 'sticky top-4 space-y-6 max-h-[calc(100vh-2rem)] overflow-y-auto hover:scrollbar-thin scrollbar-thumb-[#EBEBEB] scrollbar-track-transparent'}`}>
      {/* Sort Options */}
      <div className="border-b border-[#EBEBEB] pb-6">
        <button 
          className="w-full flex items-center justify-between font-bold text-lg mb-4 text-[#333333]"
          onClick={() => toggleSection('sort')}
        >
          <span>Sort By</span>
          <BiChevronDown className={`transform transition-transform text-[#666666] ${isExpanded.sort ? 'rotate-180' : ''}`} />
        </button>
        {isExpanded.sort && (
          <div className="space-y-3">
            {sortOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="relative w-4 h-4">
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={selectedSort === option.value}
                    onChange={() => handleSortChange(option.value)}
                    className="absolute w-4 h-4 opacity-0 cursor-pointer"
                  />
                  <div className={`w-4 h-4 border rounded-full ${
                    selectedSort === option.value 
                      ? 'border-2 border-[#333333]' 
                      : 'border-[#EBEBEB]'
                  }`}>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#333333] ${
                      selectedSort === option.value 
                        ? 'opacity-100' 
                        : 'opacity-0'
                    }`} />
                  </div>
                </div>
                <span className="text-sm text-[#666666] group-hover:text-[#333333]">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="border-b border-[#EBEBEB] pb-6">
        <button 
          className="w-full flex items-center justify-between font-bold text-lg mb-4 text-[#333333]"
          onClick={() => toggleSection('price')}
        >
          <span>Shop by Price</span>
          <BiChevronDown className={`transform transition-transform text-[#666666] ${isExpanded.price ? 'rotate-180' : ''}`} />
        </button>
        {isExpanded.price && (
          <div className="space-y-3">
            {priceRanges.map((range) => (
              <label
                key={range.value}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedPrices.includes(range.value)}
                    onChange={() => handlePriceChange(range.value)}
                    className="appearance-none w-4 h-4 border border-[#EBEBEB] rounded checked:bg-[#333333] checked:border-[#333333] transition-colors focus:outline-none"
                  />
                  {selectedPrices.includes(range.value) && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
                <span className="text-sm text-[#666666] group-hover:text-[#333333]">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Reset Button - Only show on desktop */}
      {onReset && !isMobile && (
        <button
          onClick={handleReset}
          className="w-full py-2 px-4 text-sm font-medium text-[#666666] hover:text-[#333333] transition-colors"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
