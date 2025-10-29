import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden bg-[#F4F8F4] aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
        />
        {product.tag && (
          <span className="absolute top-3 left-3 bg-[#1B5E20] text-white text-xs font-medium px-3 py-1 rounded-full">
            {product.tag}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 h-10">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-[#1B5E20]">₹{product.price.toFixed(2)}</p>
            {product.originalPrice && (
              <p className="text-xs text-gray-400 line-through">
                ₹{product.originalPrice.toFixed(2)}
              </p>
            )}
          </div>
          <button className="w-10 h-10 bg-[#F4F8F4] hover:bg-[#1B5E20] text-[#1B5E20] hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
