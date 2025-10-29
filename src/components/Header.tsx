import { Search, ShoppingCart, Heart, Package, Leaf, Home } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1B5E20] to-[#66BB6A] rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#1B5E20]">Agri AI</span>
          </div>

          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search pesticides, fertilizers…"
                className="w-full pl-11 pr-4 py-2.5 bg-[#F4F8F4] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66BB6A] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#1B5E20] transition-colors group">
              <Home className="w-6 h-6" />
              <span className="text-xs hidden sm:block">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#1B5E20] transition-colors group">
              <Package className="w-6 h-6" />
              <span className="text-xs hidden sm:block">Orders</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#1B5E20] transition-colors group relative">
              <Heart className="w-6 h-6" />
              <span className="text-xs hidden sm:block">Favourites</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#1B5E20] transition-colors group">
              <ShoppingCart className="w-6 h-6" />
              <span className="text-xs hidden sm:block">Cart</span>
            </button>
          </div>
        </div>

        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search pesticides, fertilizers…"
              className="w-full pl-11 pr-4 py-2.5 bg-[#F4F8F4] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66BB6A] focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
