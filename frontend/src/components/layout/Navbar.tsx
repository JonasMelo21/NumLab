import { useState } from "react";
import { useLang } from "../../app/i18n/LangProvider";

export default function Navbar() {
  // Global language context (now always 'en')
  const { lang } = useLang();

  // Mobile menu state
  const [open, setOpen] = useState(false);

  // Labels (English only)
  const t = {
    how: "How to use NumLab",
    about: "About the Authors",
  };

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-4">
          <a href="/" className="text-xl font-semibold text-blue-600">NumLab</a>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
            {t.how}
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
            {t.about}
          </a>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile menu button */}
          <button
            className="p-2"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
            <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">
              {t.how}
            </a>
            <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">
              {t.about}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
