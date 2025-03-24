'use client';
import { useLiked } from '../context/LikedContext';
import ProductCard from '../components/ProductCard';
import { AiOutlineHeart } from "react-icons/ai";

export default function LikedPage() {
  const { likedItems } = useLiked();

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-text">Favorieten</h1>
        <p className="text-gray-600">
          {likedItems.length} {likedItems.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {likedItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {likedItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-block p-4 bg-accent rounded-full mb-4">
            <AiOutlineHeart className="text-4xl text-text" />
          </div>
          <h2 className="text-xl font-medium mb-2 text-text">Geen favorieten</h2>
          <p className="text-gray-600">Je hebt nog geen producten toegevoegd aan je favorieten.</p>
        </div>
      )}
    </div>
  );
} 