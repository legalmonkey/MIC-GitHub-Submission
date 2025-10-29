export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-[#1B5E20] transition-colors">About</a>
            <a href="#" className="hover:text-[#1B5E20] transition-colors">Helpdesk</a>
            <a href="#" className="hover:text-[#1B5E20] transition-colors">Contact</a>
            <a href="#" className="hover:text-[#1B5E20] transition-colors">Privacy Policy</a>
          </div>
          <p className="text-sm text-gray-500">
            Copyright © 2025 Agri AI Marketplace
          </p>
        </div>
      </div>
    </footer>
  );
}
