"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductFilter from "../components/productfilter";
import { BiSearch, BiFilter } from "react-icons/bi";
import { RiFilterOffLine, RiFilterLine } from "react-icons/ri";
import { IoClose, IoFlowerOutline } from "react-icons/io5";
import { BsGrid, BsGrid3X3 } from "react-icons/bs";
import ProductCard from "../components/ProductCard";
import { getProducts, getCollections } from "../utils/shopify";
import { ProductCardSkeleton } from "../components/SkeletonLoader";
import Head from "next/head";

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
  collections?: { id: string; title: string }[];
  createdAt?: string;
}

interface Filters {
  search: string;
  color: string | null;
  priceRanges: string[];
  sort: string;
}

interface Collection {
  id: string;
  title: string;
  handle: string;
}

export default function Shop() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    color: null,
    priceRanges: [],
    sort: "featured",
  });

  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showDesktopFilter, setShowDesktopFilter] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [shouldResetFilters, setShouldResetFilters] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState<number>(16);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("featured");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(true);
  const [minPriceFilter, setMinPriceFilter] = useState(0);
  const [maxPriceFilter, setMaxPriceFilter] = useState(500);
  const [initialLoad, setInitialLoad] = useState(true);
  const [productsReady, setProductsReady] = useState(false);
  const [previousProducts, setPreviousProducts] = useState<ShopifyProduct[]>([]);
  const [gridView, setGridView] = useState<"single" | "double">("double");

  const searchParams = useSearchParams();
  const router = useRouter();

  const collectionParam = searchParams.get("collection");

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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (showMobileFilter) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMobileFilter]);

  // Fetch collections immediately on component mount
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setCollectionsLoading(true);
        // Only show filter loading on initial load
        if (initialLoad) {
          setFilterLoading(true);
        }

        const collectionsData = await getCollections();
        setCollections(collectionsData);

        // Set initial collection from URL if present
        if (collectionParam) {
          // If it's a handle, find the matching collection ID
          const matchingCollection = collectionsData.find((c: Collection) => c.handle === collectionParam || c.id === collectionParam);
          if (matchingCollection) {
            setSelectedCollection(matchingCollection.id);
          } else {
            setSelectedCollection(collectionParam);
          }
        }
      } catch (err) {
        console.error("Error fetching collections:", err);
      } finally {
        setCollectionsLoading(false);
        if (initialLoad) {
          setFilterLoading(false);
          setInitialLoad(false);
        }
      }
    };

    fetchCollections();
  }, [collectionParam, initialLoad]);

  // Fetch products when collections are loaded or collection param changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (collectionsLoading) return; // Wait for collections to load first

      try {
        setLoading(true);
        setProductsReady(false);

        // Find the collection handle if we have an ID
        let collectionQuery = collectionParam;
        if (collectionParam && collectionParam.includes("gid://")) {
          const matchingCollection = collections.find((c) => c.id === collectionParam);
          if (matchingCollection) {
            collectionQuery = matchingCollection.handle;
          }
        }

        // Fetch products (optionally filtered by collection)
        const productsData = await getProducts({
          collection: collectionQuery || undefined,
          first: 50,
        });

        setProducts(productsData);
        setFilteredProducts(productsData);

        // Set loading to false first
        setLoading(false);

        // Then set products ready after a small delay to allow for fade-in
        setTimeout(() => {
          setProductsReady(true);
        }, 100);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [collectionParam, collectionsLoading, collections]);

  // Apply filters and sorting
  const applyFiltersAndSort = useCallback(() => {
    if (!products.length) return;

    let result = [...products];

    // Filter by search term
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      result = result.filter((product) => product.title.toLowerCase().includes(searchTerm));
    }

    // Filter by collection - only if we're not already filtered by collection in the API call
    if (selectedCollection && !collectionParam) {
      result = result.filter((product) => {
        if (!product.collections || !Array.isArray(product.collections)) {
          return false;
        }
        return product.collections.some((col) => col.id === selectedCollection);
      });
    }

    // Filter by price
    if (selectedPrices.length > 0) {
      result = result.filter((product) => {
        const price = parseFloat(product.price);

        // If we're using the slider, use the exact min/max values
        if (selectedPrices.includes("exact-range")) {
          return price >= minPriceFilter && price <= maxPriceFilter;
        }

        // Otherwise use the predefined ranges
        return selectedPrices.some((range) => {
          if (range === "0-50") return price >= 0 && price <= 50;
          if (range === "50-100") return price > 50 && price <= 100;
          if (range === "100-150") return price > 100 && price <= 150;
          if (range === "150+") return price > 150;
          return false;
        });
      });
    }

    // Apply sorting
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "title-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "created-desc":
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case "created-asc":
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        });
        break;
      // 'featured' is default, no sorting needed
    }

    setFilteredProducts(result);
  }, [products, selectedPrices, sortOption, selectedCollection, collectionParam, minPriceFilter, maxPriceFilter, filters.search]);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const handlePriceFilter = (prices: string[]) => {
    setSelectedPrices(prices);
  };

  const handleSortChange = (sort: string) => {
    setSortOption(sort);
  };

  const handleCollectionChange = (collectionId: string) => {
    setSelectedCollection(collectionId);

    // Update URL with collection parameter
    if (collectionId) {
      // Find the collection handle if we have an ID
      const selectedCol = collections.find((c) => c.id === collectionId);
      if (selectedCol) {
        router.push(`/shop?collection=${selectedCol.handle}`);
      } else {
        router.push(`/shop?collection=${collectionId}`);
      }
    } else {
      router.push("/shop");
    }
  };

  const handleReset = () => {
    setSelectedPrices([]);
    setSortOption("featured");
    setSelectedCollection("");
    setShouldResetFilters(true);
    router.push("/shop");

    // Reset the flag after a short delay
    setTimeout(() => {
      setShouldResetFilters(false);
    }, 100);
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
    featured: "Sorteren op",
    "price-asc": "Prijs: Laag naar Hoog",
    "price-desc": "Prijs: Hoog naar Laag",
    "name-asc": "Naam: A tot Z",
    "name-desc": "Naam: Z tot A",
  };

  // Update price ranges (if these are in your ProductFilter component)
  const priceRanges = [
    { label: "€0 - €50", value: "0-50" },
    { label: "€50 - €100", value: "50-100" },
    { label: "€100 - €150", value: "100-150" },
    { label: "€150+", value: "150+" },
  ];

  const loadMoreProducts = () => {
    setLoadingMore(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleProducts((prev) => prev + 8);
      setLoadingMore(false);
    }, 500);
  };

  const handleExactPriceChange = (min: number, max: number) => {
    setMinPriceFilter(min);
    setMaxPriceFilter(max);
  };

  // Update the getActiveSortDisplayName function to handle all possible sort values
  const getActiveSortDisplayName = () => {
    // Handle title-asc and title-desc specifically
    if (sortOption === "title-asc") {
      return "Naam: A tot Z";
    } else if (sortOption === "title-desc") {
      return "Naam: Z tot A";
    }

    switch (sortOption) {
      case "name-asc":
        return "Naam: A tot Z";
      case "name-desc":
        return "Naam: Z tot A";
      case "price-asc":
      case "price-ascending":
        return "Prijs: Laag naar Hoog";
      case "price-desc":
      case "price-descending":
        return "Prijs: Hoog naar Laag";
      case "created-desc":
      case "created-descending":
        return "Nieuwste eerst";
      case "created-asc":
      case "created-ascending":
        return "Oudste eerst";
      case "featured":
      case "best-selling":
        return "Aanbevolen";
      default:
        return "Sorteren";
    }
  };

  return (
    <>
      <Head>
        <title>Shop | Bloemigeverleiding</title>
      </Head>
      <div className="mx-auto max-w-[1600px] px-4 py-12 md:py-20 lg:px-8">
        <div className="mb-10 flex flex-col items-start gap-6 text-text">
          <h1 className="text-3xl font-bold md:text-4xl">ONZE COLLECTIE</h1>
          <p className="max-w-3xl text-text/70">
            Ontdek onze prachtige collectie handgemaakte boeketten. Elk boeket is met zorg samengesteld met de mooiste bloemen van het seizoen.
          </p>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          {showDesktopFilter && (
            <div className="hidden w-[200px] shrink-0 xl:block">
              <div className="sticky top-[130px]">
                {filterLoading ? (
                  <div className="animate-pulse space-y-6">
                    <div className="h-6 w-3/4 rounded bg-cream/50"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded bg-cream/50"></div>
                      <div className="h-4 w-5/6 rounded bg-cream/50"></div>
                      <div className="h-4 w-4/6 rounded bg-cream/50"></div>
                    </div>
                    <div className="h-6 w-3/4 rounded bg-cream/50"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded bg-cream/50"></div>
                      <div className="h-4 w-5/6 rounded bg-cream/50"></div>
                    </div>
                    <div className="h-6 w-3/4 rounded bg-cream/50"></div>
                    <div className="h-10 w-full rounded bg-cream/50"></div>
                  </div>
                ) : (
                  <ProductFilter
                    onPriceFilter={handlePriceFilter}
                    onSortChange={handleSortChange}
                    onCollectionChange={handleCollectionChange}
                    onExactPriceChange={handleExactPriceChange}
                    onReset={handleReset}
                    isMobile={false}
                    shouldReset={shouldResetFilters}
                    collections={collections}
                    selectedCollection={selectedCollection}
                  />
                )}
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="flex flex-col gap-4">
              {/* Search Bar and Filters */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex max-w-md flex-1 items-center gap-2">
                    <div className="relative flex-1">
                      <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text" />
                      <input
                        type="text"
                        placeholder="Zoeken"
                        value={filters.search}
                        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                        className="w-full rounded-[25px] bg-cream py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-text focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={toggleFilter}
                      className="flex h-[40px] items-center gap-2 rounded-[25px] bg-cream px-4 transition-colors hover:bg-cream/70"
                    >
                      {showDesktopFilter || showMobileFilter ? <RiFilterOffLine className="text-text" /> : <RiFilterLine className="text-text" />}
                      <span className="text-sm font-medium text-text">Filter</span>
                    </button>
                  </div>
                  <div className="hidden items-center gap-2 md:flex">
                    <button
                      onClick={() => {
                        const newSortOrder = filters.sort === "price-asc" ? "price-desc" : "price-asc";
                        setFilters((prev) => ({ ...prev, sort: newSortOrder }));
                        setSortOption(newSortOrder);
                      }}
                      className="flex h-[40px] items-center gap-2 rounded-[25px] bg-cream px-4 transition-colors hover:bg-cream/70"
                    >
                      <svg
                        className={`h-4 w-4 text-text transition-transform ${filters.sort === "price-desc" ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                        />
                      </svg>
                      <span className="text-sm font-medium text-text">
                        {filters.sort === "price-desc" ? "Prijs: Hoog naar Laag" : "Prijs: Laag naar Hoog"}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        // Add a class to trigger rotation animation
                        const resetButton = document.getElementById("reset-button");
                        if (resetButton) {
                          resetButton.classList.add("animate-spin-reverse");
                          setTimeout(() => {
                            resetButton.classList.remove("animate-spin-reverse");
                          }, 300);
                        }

                        // Reset all filters
                        handleReset();

                        // Reset search input
                        setFilters((prev) => ({ ...prev, search: "" }));

                        // Reset selected collection (which will update the category text)
                        setSelectedCollection("");

                        // Also trigger the reset in the filter component
                        setShouldResetFilters(true);

                        // Reset after a short delay to allow the component to process
                        setTimeout(() => {
                          setShouldResetFilters(false);
                        }, 100);
                      }}
                      className="flex h-[40px] w-10 items-center justify-center rounded-[25px] bg-cream transition-colors hover:bg-cream/70"
                    >
                      <svg
                        id="reset-button"
                        className="h-5 w-5 text-text transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                  </div>
                  {/* Filter and Grid View Toggle */}
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex md:hidden">
                        <div className="flex rounded-full bg-cream p-1">
                          <button
                            onClick={() => setGridView("single")}
                            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                              gridView === "single" ? "bg-pink-200 text-text" : "text-text/60"
                            }`}
                            aria-label="Single column view"
                          >
                            <BsGrid className="text-lg" />
                          </button>
                          <button
                            onClick={() => setGridView("double")}
                            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                              gridView === "double" ? "bg-pink-200 text-text" : "text-text/60"
                            }`}
                            aria-label="Double column view"
                          >
                            <BsGrid3X3 className="text-lg" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Category Display */}
              <div>
                <div className="text-sm text-text/50">
                  Categorie:{" "}
                  <span className="font-medium text-text/80">
                    {selectedCollection ? collections.find((c) => c.id === selectedCollection)?.title || "" : "Alle collecties"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-full">
                    <div className="flex items-center gap-2">
                      <div className="flex w-full items-center justify-between">
                        <div className="text-sm text-text/50">{getActiveSortDisplayName()}</div>
                        <div>
                          <span className="text-sm text-text/50">Resultaten </span>
                          <span className="text-sm text-text/50">({filteredProducts.length})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div
                className={`grid gap-3 gap-y-10 md:grid-cols-3 md:gap-4 md:gap-y-10 lg:grid-cols-4 ${
                  gridView === "single" ? "grid-cols-1" : "grid-cols-2"
                }`}
              >
                {loading
                  ? // Skeleton loaders
                    Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)
                  : // Products with fade-in animation
                    filteredProducts.slice(0, visibleProducts).map((product) => (
                      <div
                        key={product.id}
                        className={`transition-opacity duration-300 ease-in-out ${productsReady ? "opacity-100" : "opacity-0"}`}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
              </div>

              {!loading && filteredProducts.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm text-text/50">Geen producten gevonden</p>
                </div>
              )}

              {visibleProducts < filteredProducts.length && (
                <div className="mt-10 flex flex-col items-center">
                  <button
                    onClick={loadMoreProducts}
                    disabled={loadingMore}
                    className="group flex items-center justify-center gap-2 rounded-[100px] border-2 border-accent bg-transparent px-10 py-3 font-medium text-text transition-all duration-300 hover:bg-accent"
                  >
                    {loadingMore ? (
                      <>
                        <span className="mr-2 animate-spin">
                          <IoFlowerOutline className="text-xl" />
                        </span>
                        Laden...
                      </>
                    ) : (
                      <>Meer producten laden</>
                    )}
                  </button>
                  <p className="mt-3 text-sm text-text/70">
                    {visibleProducts} van {filteredProducts.length} producten geladen
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter */}
        <div
          className={`fixed inset-x-0 bottom-0 top-0 z-[100] transform bg-white transition-transform duration-200 ease-out xl:hidden ${
            showMobileFilter ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-text/20 p-4">
              <h2 className="text-xl font-bold text-text">Filters</h2>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="rounded-full p-2 transition-colors hover:bg-accent"
              >
                <IoClose className="text-2xl text-text" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <ProductFilter
                onPriceFilter={handlePriceFilter}
                onSortChange={handleSortChange}
                onCollectionChange={handleCollectionChange}
                onExactPriceChange={handleExactPriceChange}
                isMobile={true}
                onReset={handleReset}
                shouldReset={shouldResetFilters}
                collections={collections}
                selectedCollection={selectedCollection}
              />
            </div>

            {/* Footer */}
            <div className="flex-btn flex gap-3 border-t border-text/20 p-4">
              <button
                onClick={() => {
                  handleReset();
                }}
                className="text-md flex-1 rounded-[100px] border border-text/20 px-4 py-2.5 font-medium text-text transition-colors hover:bg-accent"
              >
                Filters herstellen
              </button>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="text-md flex-1 rounded-[100px] bg-accent px-4 py-2.5 font-medium text-text transition-colors hover:bg-accent/70"
              >
                Filters toepassen
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="py-10 text-center text-red-400">
            <p>Error loading products: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </>
  );
}
