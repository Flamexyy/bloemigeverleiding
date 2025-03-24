'use client';
import { useState, useEffect } from 'react';
import ProductFilter from '../components/productfilter';
import { BiSearch } from "react-icons/bi";
import { RiFilterOffLine, RiFilterLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import ProductCard from '../components/ProductCard';
import { getProducts } from '../utils/shopify';

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

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-col xl:flex-row gap-6 p-4 lg:p-6">
        {showDesktopFilter && (
          <div className="hidden xl:block w-[200px] shrink-0">
            <div className="sticky top-[100px]">
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
                    placeholder="Search" 
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-cream rounded-lg py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-text focus:outline-none" 
                  />
                </div>
                <button 
                  onClick={toggleFilter}
                  className="flex items-center gap-2 bg-cream h-[40px] px-4 rounded-lg hover:bg-cream/70 transition-colors"
                >
                  <RiFilterLine className="text-[#666666]" />
                  <span className="text-sm font-medium text-text">Filter</span>
                </button>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <button 
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    sort: prev.sort === 'price-asc' ? 'price-desc' : 'price-asc' 
                  }))}
                  className="flex items-center gap-2 bg-cream h-[40px] px-4 rounded-lg hover:bg-cream/70 transition-colors"
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
                    {filters.sort === 'price-desc' ? 'Price: High to Low' : 'Price: Low to High'}
                  </span>
                </button>
                <button 
                  onClick={handleResetFilters}
                  className="flex items-center justify-center w-10 h-[40px] bg-cream rounded-lg hover:bg-cream/70 transition-colors"
                >
                  <svg className="w-5 h-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Products Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-medium text-text">Producten</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-[#666666]">Resultaten</span>
                  <span className="text-sm text-[#666666]">({filteredProducts.length})</span>
                </div>
              </div>
              <div className="text-sm text-[#666666]">
                {filters.sort === 'featured' && 'Aanbevolen'}
                {filters.sort === 'price-asc' && 'Prijs laag naar hoog'}
                {filters.sort === 'price-desc' && 'Prijs: hoog naar laag'}
                {filters.sort === 'name-asc' && 'Naam: A tot Z'}
                {filters.sort === 'name-desc' && 'Naam: Z tot A'}
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-6'>
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="animate-pulse mb-4">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4" />
                    <div className="flex flex-col gap-2">
                      <div className="h-5 bg-gray-100 rounded-lg w-3/4" />
                      <div className="h-5 bg-gray-100 rounded-lg w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-6'>
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
                <p className="text-sm text-gray-500">Geen producten gevonden</p>
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
          <div className="flex justify-between items-center p-4 border-b border-[#EBEBEB]">
            <h2 className="text-lg font-medium text-[#333333]">Filters</h2>
            <button 
              onClick={() => setShowMobileFilter(false)}
              className="p-1 hover:bg-[#F5F5F5] rounded-full transition-colors"
            >
              <IoClose className="text-2xl text-[#666666]" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <ProductFilter 
              onPriceFilter={handlePriceFilter}
              onSortChange={handleSortChange}
              onReset={handleResetFilters}
              isMobile={true}
              shouldReset={shouldResetFilters}
            />
          </div>
          <div className="border-t border-[#EBEBEB] p-4 flex gap-3">
            <button 
              onClick={() => {
                handleResetFilters();
                // The mobile filter component will be updated through props
              }}
              className="flex-1 py-2.5 px-4 border border-[#EBEBEB] rounded-lg hover:bg-[#F5F5F5] transition-colors text-sm font-medium text-[#333333]"
            >
              Filters verwijderen
            </button>
            <button 
              onClick={() => setShowMobileFilter(false)}
              className="flex-1 py-2.5 px-4 bg-[#18181B] text-white rounded-lg hover:bg-[#09090B] transition-colors text-sm font-medium"
            >
              Filters toepassen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 