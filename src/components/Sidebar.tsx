import { Star } from 'lucide-react';
import { useState } from 'react';
import type { FilterState } from '../types';

const brands = ['UPL', 'Bayer', 'Syngenta', 'Coromandel', 'Mahadhan'];
const types = ['Organic', 'Chemical'];
const deliveryOptions = ['Standard', 'Express'];

export default function Sidebar() {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [100, 5000],
    minRating: 0,
    brands: [],
    types: [],
    delivery: []
  });

  const toggleArrayFilter = (key: keyof Pick<FilterState, 'brands' | 'types' | 'delivery'>, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }));
  };

  return (
    <aside className="w-64 bg-white rounded-lg shadow-sm p-6 h-fit sticky top-20">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Filters</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
          <div className="space-y-2">
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={filters.priceRange[1]}
              onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [100, parseInt(e.target.value)] }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1B5E20]"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>₹{filters.priceRange[0]}</span>
              <span>₹{filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Star Rating</h3>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === rating}
                  onChange={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                  className="w-4 h-4 text-[#1B5E20] accent-[#1B5E20]"
                />
                <div className="flex items-center gap-1">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600">& Up</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Brand</h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => toggleArrayFilter('brands', brand)}
                  className="w-4 h-4 text-[#1B5E20] rounded accent-[#1B5E20]"
                />
                <span className="text-sm text-gray-600">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Type</h3>
          <div className="space-y-2">
            {types.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.types.includes(type)}
                  onChange={() => toggleArrayFilter('types', type)}
                  className="w-4 h-4 text-[#1B5E20] rounded accent-[#1B5E20]"
                />
                <span className="text-sm text-gray-600">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Delivery Options</h3>
          <div className="space-y-2">
            {deliveryOptions.map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.delivery.includes(option)}
                  onChange={() => toggleArrayFilter('delivery', option)}
                  className="w-4 h-4 text-[#1B5E20] rounded accent-[#1B5E20]"
                />
                <span className="text-sm text-gray-600">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <button className="w-full py-2 bg-[#F4F8F4] text-[#1B5E20] rounded-lg font-medium hover:bg-[#1B5E20] hover:text-white transition-colors">
          Reset Filters
        </button>
      </div>
    </aside>
  );
}
