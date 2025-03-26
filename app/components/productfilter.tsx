'use client';
import { useState, useEffect } from 'react';
import { BiChevronDown } from "react-icons/bi";

interface ProductFilterProps {
  onPriceFilter?: (value: string[]) => void;
  onSortChange?: (sort: string) => void;
  onCollectionChange?: (collection: string) => void;
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
  initialPrice = 250,
  isMobile = false,
  onReset,
  shouldReset = false,
  collections = [],
  selectedCollection = ''
}: ProductFilterProps) {
  const [selectedSort, setSelectedSort] = useState<string>('featured');
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [activeCollection, setActiveCollection] = useState<string>(selectedCollection);
  const [isExpanded, setIsExpanded] = useState({
    sort: true,
    price: true,
    collection: true
  });

  // Reset when shouldReset changes to true
  useEffect(() => {
    if (shouldReset) {
      setSelectedSort('featured');
      setSelectedPrices([]);
      setActiveCollection('');
    }
  }, [shouldReset]);

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    if (onSortChange) {
      onSortChange(sort);
    }
  };

  const handlePriceChange = (price: string) => {
    let newSelectedPrices;
    
    if (selectedPrices.includes(price)) {
      newSelectedPrices = selectedPrices.filter(p => p !== price);
    } else {
      newSelectedPrices = [...selectedPrices, price];
    }
    
    setSelectedPrices(newSelectedPrices);
    
    if (onPriceFilter) {
      onPriceFilter(newSelectedPrices);
    }
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
    if (onReset) {
      onReset();
    }
  };

  const priceRanges = [
    { value: '0-25', label: '€0 - €25' },
    { value: '25-50', label: '€25 - €50' },
    { value: '50-100', label: '€50 - €100' },
    { value: '100-200', label: '€100 - €200' },
    { value: '200+', label: '€200+' }
  ];

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
    <div className={`space-y-6 ${isMobile ? 'p-4' : ''}`}>
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

      {/* Price Filter */}
      <div>
        <button 
          className="flex items-center justify-between w-full text-text font-medium"
          onClick={() => setIsExpanded({...isExpanded, price: !isExpanded.price})}
        >
          <span>Prijs</span>
          <BiChevronDown className={`text-xl transition-transform ${isExpanded.price ? 'rotate-180' : ''}`} />
        </button>
        
        {isExpanded.price && (
          <div className="mt-3 space-y-2">
            {priceRanges.map(range => (
              <label key={range.value} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  value={range.value}
                  checked={selectedPrices.includes(range.value)}
                  onChange={() => handlePriceChange(range.value)}
                  className="hidden"
                />
                <div className="w-4 h-4 border border-text/30 rounded flex items-center justify-center group-hover:border-text relative">
                  {selectedPrices.includes(range.value) && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
                <span className="text-md text-text group-hover:text-text">{range.label}</span>
              </label>
            ))}
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
  );
}
