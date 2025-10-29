import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import Sidebar from './components/Sidebar';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#F4F8F4]">
      <Header />
      <CategoryTabs />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <ProductGrid />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
