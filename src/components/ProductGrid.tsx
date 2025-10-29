import ProductCard from './ProductCard';
import type { Product } from '../types';

const products: Product[] = [
  {
    id: 1,
    name: 'UPL SAAF Fungicide 100gm',
    price: 230,
    originalPrice: 280,
    image: 'https://5.imimg.com/data5/SELLER/Default/2023/4/302168763/TY/KX/IS/19090231/upl-saaf-fungicide-500x500.jpeg',
    rating: 4.5,
    reviews: 142,
    brand: 'UPL',
    category: 'Pesticides',
    isOrganic: false,
    tag: 'Best Seller'
  },
  {
    id: 2,
    name: 'Bayer Confidor Insecticide 100ml',
    price: 450,
    originalPrice: 520,
    image: 'https://cdn.shopify.com/s/files/1/0549/4564/4684/files/Bayer_Confidor_Imidacloprid_200_SL_1.webp?v=1741254829',
    rating: 4.8,
    reviews: 89,
    brand: 'Bayer',
    category: 'Pesticides',
    isOrganic: false,
    tag: 'Top Rated'
  },
  {
    id: 3,
    name: 'Mahadhan 19:19:19 Water Soluble Fertilizer',
    price: 1200,
    image: 'https://mahadhan.co.in/wp-content/uploads/2017/05/Bag-Mockup.jpg',
    rating: 4.6,
    reviews: 234,
    brand: 'Mahadhan',
    category: 'Fertilizers',
    isOrganic: false
  },
  {
    id: 4,
    name: 'Organic Bio Neem Oil 1L',
    price: 390,
    originalPrice: 450,
    image: 'https://gogarden.co.in/cdn/shop/files/WhatsApp_Image_2025-03-07_at_20.35.09_ee08c59d.jpg?v=1741857995',
    rating: 4.7,
    reviews: 178,
    brand: 'UPL',
    category: 'Bio-products',
    isOrganic: true,
    tag: 'Top Rated'
  },
  {
    id: 5,
    name: 'Coromandel Gromor Urea 45kg',
    price: 620,
    image: 'https://www.coromandel.biz/wp-content/uploads/2025/02/Gromor-Magik.png',
    rating: 4.4,
    reviews: 312,
    brand: 'Coromandel',
    category: 'Fertilizers',
    isOrganic: false
  },
  {
    id: 6,
    name: 'Syngenta Acephate 75% SP Insecticide',
    price: 380,
    originalPrice: 420,
    image: 'https://5.imimg.com/data5/SELLER/Default/2025/6/515996924/LE/NN/WJ/78524298/acephate-75-sp-insecticide.jpg',
    rating: 4.3,
    reviews: 95,
    brand: 'Syngenta',
    category: 'Pesticides',
    isOrganic: false
  },
  {
    id: 7,
    name: 'Bio Growth Booster Liquid 500ml',
    price: 580,
    image: 'https://gogarden.co.in/cdn/shop/files/GoGardenGrowthBoosterFertilizerforPlant_4.jpg?v=1741857870',
    rating: 4.9,
    reviews: 201,
    brand: 'Bayer',
    category: 'Growth Boosters',
    isOrganic: true,
    tag: 'Best Seller'
  },
  {
    id: 8,
    name: 'Mahadhan Micronutrient Mix 1kg',
    price: 340,
    image: 'https://mahadhan.co.in/wp-content/uploads/2017/05/mircronutrients2-300x413.jpg',
    rating: 4.5,
    reviews: 167,
    brand: 'Mahadhan',
    category: 'Soil Nutrients',
    isOrganic: false
  },
  {
    id: 9,
    name: 'UPL Cytoplant Growth Regulator 100ml',
    price: 750,
    originalPrice: 850,
    image: 'https://www.indohobby.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/u/p/upl_ustaad_insecticide.jpg',
    rating: 4.6,
    reviews: 123,
    brand: 'UPL',
    category: 'Growth Boosters',
    isOrganic: false
  },
  {
    id: 10,
    name: 'Coromandel Phosphate Rich Organic Manure',
    price: 890,
    image: 'https://images.jdmagicbox.com/quickquotes/images_main/coromandel-gromor-parry-super-fertiliser-08-01-2021-048-219994176-87yu6.gif',
    rating: 4.8,
    reviews: 289,
    brand: 'Coromandel',
    category: 'Bio-products',
    isOrganic: true,
    tag: 'Top Rated'
  },
  {
    id: 11,
    name: 'Syngenta Amistar Top Fungicide 250ml',
    price: 980,
    originalPrice: 1100,
    image: 'https://www.syngenta.co.in/sites/g/files/kgtney376/files/styles/syn_full_width_scale/public/media/image/2019/07/15/amistar.jpg?itok=TS3DLl7Y',
    rating: 4.7,
    reviews: 145,
    brand: 'Syngenta',
    category: 'Pesticides',
    isOrganic: false
  },
  {
    id: 12,
    name: 'Bayer Nativo Fungicide 100gm',
    price: 425,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOhT_nie8eoaGlVBJk639MZ4f_hU7ASOsy7g&s',
    rating: 4.4,
    reviews: 198,
    brand: 'Bayer',
    category: 'Pesticides',
    isOrganic: false,
    tag: 'Best Seller'
  }
];

export default function ProductGrid() {
  return (
    <section className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{products.length}</span> products
        </p>
        <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-sm">
          <option>Sort by: Featured</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Rating: High to Low</option>
          <option>Newest First</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
