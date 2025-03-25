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
    { value: 'featured', label: 'Sorteren op' },
    { value: 'price-asc', label: 'Prijs: Laag naar Hoog' },
    { value: 'price-desc', label: 'Prijs: Hoog naar Laag' },
    { value: 'name-asc', label: 'Naam: A tot Z' },
    { value: 'name-desc', label: 'Naam: Z tot A' }
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
    <div className={`${isMobile ? 'space-y-6' : 'sticky top-4 space-y-6 max-h-[calc(100vh-2rem)] overflow-y-auto hover:scrollbar-thin scrollbar-thumb-[#EBEBEB] scrollbar-track-transparent overflow-x-hidden'}`}>
      {/* Sort Options */}
      <div className="border-b border-[#EBEBEB] pb-6">
        <button 
          className="w-full flex items-center justify-between font-bold text-lg mb-4 text-text"
          onClick={() => toggleSection('sort')}
        >
          <span>Sorteren op</span>
          <BiChevronDown className={`transform transition-transform text-text ${isExpanded.sort ? 'rotate-180' : ''}`} />
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
                      ? 'border-2 border-text' 
                      : 'border-[#EBEBEB]'
                  }`}>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-text ${
                      selectedSort === option.value 
                        ? 'opacity-100' 
                        : 'opacity-0'
                    }`} />
                  </div>
                </div>
                <span className="text-sm text-text group-hover:text-text">
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
          className="w-full flex items-center justify-between font-bold text-lg mb-4 text-text"
          onClick={() => toggleSection('price')}
        >
          <span>Prijs</span>
          <BiChevronDown className={`transform transition-transform text-text ${isExpanded.price ? 'rotate-180' : ''}`} />
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
                    className="appearance-none w-4 h-4 border border-[#EBEBEB] rounded checked:bg-text checked:border-text transition-colors focus:outline-none"
                  />
                  {selectedPrices.includes(range.value) && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
                <span className="text-sm text-text group-hover:text-text">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Reset Button */}
      {onReset && !isMobile && (
        <button
          onClick={handleReset}
          className="w-full py-2 px-4 text-sm font-medium text-text hover:text-text transition-colors"
        >
          Herstel filters
        </button>
      )}
    </div>
  );
}
