'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from './components/ProductCard';
import { getProducts } from './utils/shopify';
import Image from 'next/image';
import { RiArrowRightUpLine } from "react-icons/ri";
import Claims from './components/Claims';
import Faq from './components/Faq';
import { ProductCardSkeleton } from './components/SkeletonLoader';

interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  price: string;
  imageUrl: string;
  availableForSale: boolean;
  variantId: string;
  quantityAvailable?: number;
}

export default function Home() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        const formattedProducts = data.map((product: ShopifyProduct) => ({
          ...product,
          quantityAvailable: product.quantityAvailable || 1
        }));
        setProducts(formattedProducts);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div>
        <div className="relative w-full h-auto flex flex-col justify-center lg:flex-row items-center gap-14 pt-[80px] p-4 lg:p-8">
      {/* Text Section */}
      <div className="flex items-center justify-center text-center">
        <div className="text-text space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <Image 
              src="/logo.svg" 
              alt="Bloemigeverleiding Logo" 
              width={200} 
              height={50} 
              className="inline-block"
            />
            </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto pb-2">
            "De liefde voor bloemen die altijd bloeien"
          </p>
          <div className="w-full flex justify-center items-center">
            <Link className="w-fit" href="/shop">
               <button 
                  className='flex items-center justify-center px-8 p-3 bg-accent text-text hover:bg-accent/70 rounded-[100px] transition-all duration-300'
                >Shop nu
                </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="w-full md:w-[400px] h-[500px] relative">
        <Image
          src="/top-view-beautiful-roses-bouquet-with-pink-ribbon.jpg"
          alt="Hero Image"
          fill
          className="object-cover rounded-bl-[100px] rounded-tr-[100px] rounded-[50px] lg:rounded-t-[500px]"
          priority
        />
      </div>
    </div>


      {/* Rest of Content - Constrained Width */}
      <div className="max-w-[1600px] mx-auto">
        {/* Featured Products */}
        <div className="p-4 lg:p-8 py-14 lg:py-20">
          <div className="flex flex-col gap-6 items-start mb-10 text-text">
            <div className='w-full flex justify-between items-start gap-10'>
              <div className='max-w-[800px]'>
                <h2 className="text-3xl font-bold">Boeketten</h2>
              </div>
              <Link 
                href="/shop"
                className="min-w-fit flex items-center gap-2 transition-opacity mt-2 group"
              >
                Bekijk alles
                <RiArrowRightUpLine className="text-xl group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-transform duration-300" />
              </Link>
            </div>
            <p className='max-w-[800px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo odio quas vitae aspernatur optio quae quidem cumque natus necessitatibus. Natus nisi ipsam commodi libero, obcaecati eligendi iste consequatur eos totam?</p>
          </div>

          {loading && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-10 text-red-400">
              <p>Error loading products: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {products.slice(0, 4).map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <Link 
                  href="/shop"
                    className='flex items-center justify-center px-10 p-3 bg-transparent text-text border-2 border-accent hover:bg-accent rounded-[100px] transition-all duration-300'
                >
                  Bekijk alle producten
                </Link>
              </div>
            </>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-10">
              <p>No products found</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
        <Claims />
        <Faq />
      </div>
    </div>
  );
}
