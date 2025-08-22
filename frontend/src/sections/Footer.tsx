export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Logo */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold text-blue-400 mb-4">NumLab</h3>
            <p className="text-gray-400">Laboratory of Numerical Analysis</p>
          </div>

          {/* Center Column - Quick Links */}
          <div className="flex flex-col">
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col space-y-2">
              <a
                href="#how-to-use"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                How to Use
              </a>
              <a
                href="#about-author"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                About the Author
              </a>
            </div>
          </div>

          {/* Right Column - Contact */}
          <div className="flex flex-col">
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="flex flex-col space-y-2 text-gray-400">
              <a
                href="mailto:jonashonorato4@gmail.com"
                className="hover:text-blue-400 transition-colors break-all"
              >
                jonashonorato4@gmail.com
              </a>
              <a
                href="https://github.com/jonasmelo21"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                github.com/jonasmelo21
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">© 2025 NumLab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
