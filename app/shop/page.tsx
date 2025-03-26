'use client';
import { useState, useEffect } from 'react';
import ProductFilter from '../components/productfilter';
import { BiSearch } from "react-icons/bi";
import { RiFilterOffLine, RiFilterLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import ProductCard from '../components/ProductCard';
import { getProducts } from '../utils/shopify';
import { ProductCardSkeleton } from '../components/SkeletonLoader';

interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  price: string;
  compareAtPrice?: string;
  imageUrl: string;
  availableForSale: boolean;
  variantId: string;
  colors?: string[];
  quantityAvailable: number;
}

interface Filters {
  search: string;
  color: string | null;
  priceRanges: string[];
  sort: string;
}

export default function Shop() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    color: null,
    priceRanges: [],
    sort: 'featured'
  });

  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showDesktopFilter, setShowDesktopFilter] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [shouldResetFilters, setShouldResetFilters] = useState(false);

  // Reset the shouldResetFilters flag after it's been consumed
  useEffect(() => {
    if (shouldResetFilters) {
      setShouldResetFilters(false);
    }
  }, [shouldResetFilters]);

  // Mobile menu handlers
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1280);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (showMobileFilter) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileFilter]);

  // Fetch products on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply color filter
    if (filters.color) {
      filtered = filtered.filter(product => 
        product.colors?.includes(filters.color!)
      );
    }

    // Apply price range filter
    if (filters.priceRanges.length > 0) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price);
        return filters.priceRanges.some(range => {
          if (range === '150+') {
            return price >= 150;
          }
          const [min, max] = range.split('-').map(Number);
          return price >= min && price <= max;
        });
      });
    }

    // Apply sort
    if (filters.sort !== 'featured') {
      filtered.sort((a, b) => {
        switch (filters.sort) {
          case 'price-asc':
            return parseFloat(a.price) - parseFloat(b.price);
          case 'price-desc':
            return parseFloat(b.price) - parseFloat(a.price);
          case 'name-asc':
            return a.title.localeCompare(b.title);
          case 'name-desc':
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  const handlePriceFilter = (priceRanges: string[]) => {
    setFilters(prev => ({ ...prev, priceRanges }));
  };

  const handleSortChange = (sort: string) => {
    setFilters(prev => ({ ...prev, sort }));
  };

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleResetFilters = () => {
    // Reset all filters
    setFilters({
      search: '',
      color: null,
      priceRanges: [],
      sort: 'featured'
    });
    
    // Trigger reset in filter component
    setShouldResetFilters(true);
  };

  const toggleFilter = () => {
    if (!isMobile) {
      setShowDesktopFilter(!showDesktopFilter);
    } else {
      setShowMobileFilter(!showMobileFilter);
    }
  };

  // Update sorting options
  const sortOptions = {
    featured: 'Sorteren op',
    'price-asc': 'Prijs: Laag naar Hoog',
    'price-desc': 'Prijs: Hoog naar Laag',
    'name-asc': 'Naam: A tot Z',
    'name-desc': 'Naam: Z tot A'
  };

  // Update price ranges (if these are in your ProductFilter component)
  const priceRanges = [
    { label: '€0 - €50', value: '0-50' },
    { label: '€50 - €100', value: '50-100' },
    { label: '€100 - €150', value: '100-150' },
    { label: '€150+', value: '150+' }
  ];

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-col xl:flex-row gap-6 p-4 lg:p-6">
        {showDesktopFilter && (
          <div className="hidden xl:block w-[200px] shrink-0">
            <div className="sticky top-[130px]">
              <ProductFilter
                onPriceFilter={handlePriceFilter}
                onSortChange={handleSortChange}
                onReset={handleResetFilters}
                isMobile={false}
              />
            </div>
          </div>
        )}
        
        <div className='flex-1'>
          <div className="flex flex-col gap-4">
            {/* Search Bar and Filters */}
            <div className="flex items-center gap-2">
              <div className="flex-1 max-w-md flex items-center gap-2">
                <div className="relative flex-1">
                  <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text" />
                  <input 
                    type="text" 
                    placeholder="Zoeken"
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-cream rounded-[25px] py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-text focus:outline-none" 
                  />
                </div>
                <button 
                  onClick={toggleFilter}
                  className="flex items-center gap-2 bg-cream h-[40px] px-4 rounded-[25px] hover:bg-cream/70 transition-colors"
                >
                  {showDesktopFilter || showMobileFilter ? (
                    <RiFilterOffLine className="text-text" />
                  ) : (
                    <RiFilterLine className="text-text" />
                  )}
                  <span className="text-sm font-medium text-text">Filter</span>
                </button>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <button 
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    sort: prev.sort === 'price-asc' ? 'price-desc' : 'price-asc' 
                  }))}
                  className="flex items-center gap-2 bg-cream h-[40px] px-4 rounded-[25px] hover:bg-cream/70 transition-colors"
                >
                  <svg 
                    className={`w-4 h-4 transition-transform text-text ${filters.sort === 'price-desc' ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  <span className="text-sm font-medium text-text">
                    {filters.sort === 'price-desc' ? 'Prijs: Hoog naar Laag' : 'Prijs: Laag naar Hoog'}
                  </span>
                </button>
                <button 
                  onClick={() => {
                    // Add a class to trigger rotation animation
                    const resetButton = document.getElementById('reset-button');
                    if (resetButton) {
                      resetButton.classList.add('animate-spin-reverse');
                      setTimeout(() => {
                        resetButton.classList.remove('animate-spin-reverse');
                      }, 300);
                    }
                    
                    // Reset all filters
                    handleResetFilters();
                    
                    // Also trigger the reset in the filter component
                    setShouldResetFilters(true);
                    
                    // Reset after a short delay to allow the component to process
                    setTimeout(() => {
                      setShouldResetFilters(false);
                    }, 100);
                  }}
                  className="flex items-center justify-center w-10 h-[40px] bg-cream rounded-[25px] hover:bg-cream/70 transition-colors"
                >
                  <svg 
                    id="reset-button"
                    className="w-5 h-5 text-text transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Products Header */}
            <div className="flex items-center justify-between">
              <div className='w-full'>
                <div className="flex items-center gap-2">
                  <div className='flex w-full justify-between items-center'>
                    <div>
                      <span className="text-sm text-text/50">Resultaten </span>
                      <span className="text-sm text-text/50">({filteredProducts.length})</span>
                    </div> 
                    <div className="text-sm text-text/50">
                      {filters.sort === 'featured' && 'Sorteren op'}
                      {filters.sort === 'price-asc' && 'Prijs: Laag naar Hoog'}
                      {filters.sort === 'price-desc' && 'Prijs: Hoog naar Laag'}
                      {filters.sort === 'name-asc' && 'Naam: A tot Z'}
                      {filters.sort === 'name-desc' && 'Naam: Z tot A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-4'>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-text/50">Geen producten gevonden</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter */}
      <div 
        className={`fixed inset-x-0 top-0 bottom-0 bg-white xl:hidden z-[100] transform transition-transform duration-200 ease-out ${
          showMobileFilter ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-text/20">
            <h2 className="text-xl font-medium text-text">Filters</h2>
            <button 
              onClick={() => setShowMobileFilter(false)}
              className="p-2 hover:bg-accent rounded-full transition-colors"
            >
              <IoClose className="text-2xl text-text" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <ProductFilter 
              onPriceFilter={handlePriceFilter}
              onSortChange={handleSortChange}
              onReset={handleResetFilters}
              isMobile={true}
              shouldReset={shouldResetFilters}
            />
          </div>

          {/* Footer */}
          <div className="border-t border-text/20 p-4 flex gap-3">
            <button 
              onClick={() => {
                handleResetFilters();
              }}
              className="flex-1 py-2.5 px-4 border border-text/20 rounded-[100px] hover:bg-accent transition-colors text-md font-medium text-text"
            >
              Filters verwijderen
            </button>
            <button 
              onClick={() => setShowMobileFilter(false)}
              className="flex-1 py-2.5 px-4 bg-accent text-text rounded-[100px] hover:bg-accent/70 transition-colors text-md font-medium"
            >
              Filters toepassen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 