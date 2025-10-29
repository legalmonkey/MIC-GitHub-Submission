import { useState } from 'react';

const categories = [
  'All Categories',
  'Fertilizers',
  'Pesticides',
  'Bio-products',
  'Soil Nutrients',
  'Growth Boosters'
];

export default function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState('All Categories');

  return (
    <div className="bg-white border-b border-gray-200 overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap pb-2 border-b-2 transition-all font-medium ${
                activeCategory === category
                  ? 'border-[#1B5E20] text-[#1B5E20]'
                  : 'border-transparent text-gray-600 hover:text-[#1B5E20]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
