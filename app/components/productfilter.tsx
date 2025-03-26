'use client';
import { useState, useEffect, useRef } from 'react';
import { BiChevronDown } from "react-icons/bi";

interface ProductFilterProps {
  onPriceFilter?: (value: string[]) => void;
  onSortChange?: (sort: string) => void;
  onCollectionChange?: (collection: string) => void;
  onExactPriceChange?: (min: number, max: number) => void;
  initialPrice?: number;
  isMobile?: boolean;
  onReset?: () => void;
  shouldReset?: boolean;
  collections?: {id: string, title: string}[];
  selectedCollection?: string;
}

export default function ProductFilter({ 
  onPriceFilter,
  onSortChange,
  onCollectionChange,
  onExactPriceChange,
  initialPrice = 250,
  isMobile = false,
  onReset,
  shouldReset = false,
  collections = [],
  selectedCollection = '',
}: ProductFilterProps) {
  const [selectedSort, setSelectedSort] = useState<string>('featured');
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [activeCollection, setActiveCollection] = useState<string>(selectedCollection);
  const [isExpanded, setIsExpanded] = useState({
    sort: true,
    price: true,
    collection: true
  });
  
  // Price range slider state
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [sliderValue, setSliderValue] = useState<number>(200);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset when shouldReset changes to true
  useEffect(() => {
    if (shouldReset) {
      setSelectedSort('featured');
      setSelectedPrices([]);
      setActiveCollection('');
      setMinPrice(0);
      setMaxPrice(200);
      setSliderValue(200);
    }
  }, [shouldReset]);

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    if (onSortChange) {
      onSortChange(sort);
    }
  };

  // Updated price filter logic to match the shop page's expected format
  const handlePriceChange = (min = minPrice, max = maxPrice) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a new timeout to avoid too many updates
    timeoutRef.current = setTimeout(() => {
      // Use exact price filtering with the slider
      const priceRanges = ['exact-range'];
      
      console.log('Using exact price range:', min, max);
      setSelectedPrices(priceRanges);
      
      if (onPriceFilter) {
        // Pass the exact min/max values along with the ranges
        onPriceFilter(priceRanges);
        
        // Also update the parent component with the min/max values
        if (onExactPriceChange) {
          onExactPriceChange(min, max);
        }
      }
    }, 300);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const newMinPrice = Math.min(value, maxPrice);
    setMinPrice(newMinPrice);
    
    // Immediately use the new value for filtering
    if (onExactPriceChange) {
      onExactPriceChange(newMinPrice, maxPrice);
    }
    
    handlePriceChange(newMinPrice, maxPrice);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const newMaxPrice = Math.max(value, minPrice);
    setMaxPrice(newMaxPrice);
    setSliderValue(newMaxPrice);
    
    // Immediately use the new value for filtering
    if (onExactPriceChange) {
      onExactPriceChange(minPrice, newMaxPrice);
    }
    
    handlePriceChange(minPrice, newMaxPrice);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    setMaxPrice(value);
    
    // Immediately use the new value for filtering
    if (onExactPriceChange) {
      onExactPriceChange(minPrice, value);
    }
    
    handlePriceChange(minPrice, value);
  };

  const handleCollectionChange = (collection: string) => {
    setActiveCollection(collection);
    if (onCollectionChange) {
      onCollectionChange(collection);
    }
  };

  const handleReset = () => {
    setSelectedSort('featured');
    setSelectedPrices([]);
    setActiveCollection('');
    setMinPrice(0);
    setMaxPrice(500);
    setSliderValue(500);
    if (onReset) {
      onReset();
    }
  };

  const sortOptions = [
    { value: 'featured', label: 'Aanbevolen' },
    { value: 'price-asc', label: 'Prijs: laag naar hoog' },
    { value: 'price-desc', label: 'Prijs: hoog naar laag' },
    { value: 'title-asc', label: 'Naam: A-Z' },
    { value: 'title-desc', label: 'Naam: Z-A' },
    { value: 'created-desc', label: 'Nieuwste eerst' },
    { value: 'created-asc', label: 'Oudste eerst' }
  ];

  return (
    <>
      <style jsx>{`
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #654b56;
          cursor: pointer;
          border: 2px solid #fff;
        }
        
        .custom-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #654b56;
          cursor: pointer;
          border: 2px solid #fff;
        }
      `}</style>
      
      <div className={`space-y-6 ${isMobile ? 'p-4' : ''}`}>
        {/* Collections Filter */}
        {collections.length > 0 && (
          <div>
            <button 
              className="flex items-center justify-between w-full text-text font-medium"
              onClick={() => setIsExpanded({...isExpanded, collection: !isExpanded.collection})}
            >
              <span>Collecties</span>
              <BiChevronDown className={`text-xl transition-transform ${isExpanded.collection ? 'rotate-180' : ''}`} />
            </button>
            
            {isExpanded.collection && (
              <div className="mt-3 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="collection" 
                    value=""
                    checked={activeCollection === ''}
                    onChange={() => handleCollectionChange('')}
                    className="hidden"
                  />
                  <div className="w-4 h-4 border border-text/30 rounded-full flex items-center justify-center group-hover:border-text">
                    {activeCollection === '' && (
                      <div className="w-2 h-2 bg-text rounded-full"></div>
                    )}
                  </div>
                  <span className="text-md text-text group-hover:text-text">Alle collecties</span>
                </label>
                
                {collections.map(collection => (
                  <label key={collection.id} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="collection" 
                      value={collection.id}
                      checked={activeCollection === collection.id}
                      onChange={() => handleCollectionChange(collection.id)}
                      className="hidden"
                    />
                    <div className="w-4 h-4 border border-text/30 rounded-full flex items-center justify-center group-hover:border-text">
                      {activeCollection === collection.id && (
                        <div className="w-2 h-2 bg-text rounded-full"></div>
                      )}
                    </div>
                    <span className="text-md text-text group-hover:text-text">{collection.title}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sort By */}
        <div>
          <button 
            className="flex items-center justify-between w-full text-text font-medium"
            onClick={() => setIsExpanded({...isExpanded, sort: !isExpanded.sort})}
          >
            <span>Sorteren op</span>
            <BiChevronDown className={`text-xl transition-transform ${isExpanded.sort ? 'rotate-180' : ''}`} />
          </button>
          
          {isExpanded.sort && (
            <div className="mt-3 space-y-2">
              {sortOptions.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="sort" 
                    value={option.value}
                    checked={selectedSort === option.value}
                    onChange={() => handleSortChange(option.value)}
                    className="hidden"
                  />
                  <div className="w-4 h-4 border border-text/30 rounded-full flex items-center justify-center group-hover:border-text">
                    {selectedSort === option.value && (
                      <div className="w-2 h-2 bg-text rounded-full"></div>
                    )}
                  </div>
                  <span className="text-md text-text group-hover:text-text">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Filter with Slider */}
        <div>
          <button 
            className="flex items-center justify-between w-full text-text font-medium"
            onClick={() => setIsExpanded({...isExpanded, price: !isExpanded.price})}
          >
            <span>Prijs</span>
            <BiChevronDown className={`text-xl transition-transform ${isExpanded.price ? 'rotate-180' : ''}`} />
          </button>
          
          {isExpanded.price && (
            <div className="mt-4 space-y-4">
              {/* Min-Max Input Fields */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text/70">€</span>
                  <input 
                    type="number" 
                    min="0"
                    max={maxPrice}
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    className="w-full bg-cream rounded-[25px] py-2 pl-8 pr-3 text-sm text-text focus:outline-none"
                    placeholder="Min"
                  />
                </div>
                <span className="text-text/70">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text/70">€</span>
                  <input 
                    type="number"
                    min={minPrice}
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    className="w-full bg-cream rounded-[25px] py-2 pl-8 pr-3 text-sm text-text focus:outline-none"
                    placeholder="Max"
                  />
                </div>
              </div>
              
              {/* Slider */}
              <div className="px-1">
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={sliderValue}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-cream rounded-full appearance-none cursor-pointer custom-slider"
                  style={{
                    background: `linear-gradient(to right, #654b56 0%, #654b56 ${(sliderValue / 500) * 100}%, #ffe5f1 ${(sliderValue / 500) * 100}%,#ffe5f1 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-text/70 mt-1">
                  <span>€0</span>
                  <span>€500+</span>
                </div>
              </div>
              
              {/* Current Price Range Display */}
              <div className="text-sm text-text/70 text-center">
                {minPrice === 0 && maxPrice >= 500 ? (
                  <span>Alle prijzen</span>
                ) : (
                  <span>€{minPrice} - {maxPrice >= 500 ? '€500+' : `€${maxPrice}`}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Reset Button */}
        {onReset && !isMobile && (
          <button
            onClick={handleReset}
            className="w-full py-2 px-4 text-sm font-medium text-text transition-colors hover:underline"
          >
            Herstel filters
          </button>
        )}
      </div>
    </>
  );
}
