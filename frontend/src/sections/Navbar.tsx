import { useState } from "react";

export default function Navbar() {
  const [language, setLanguage] = useState<"en" | "pt">("en");
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand + Lang Switch */}
        <div className="flex items-center space-x-4">
          <a href="/" className="text-xl font-semibold text-blue-600">NumLab</a>

          {/* Language Switch Buttons */}
          <div className="hidden sm:flex items-center bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                language === "en"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              aria-pressed={language === "en"}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("pt")}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                language === "pt"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              aria-pressed={language === "pt"}
            >
              PT
            </button>
          </div>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
            How to use NumLab
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
            About the Authors
          </a>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Lang switch (mobile) */}
          <div className="flex items-center bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                language === "en"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              aria-pressed={language === "en"}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("pt")}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                language === "pt"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              aria-pressed={language === "pt"}
            >
              PT
            </button>
          </div>

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
              How to use NumLab
            </a>
            <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">
              About the Authors
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
