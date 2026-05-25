import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Tratamiento', path: '/tratamiento' },
    { name: 'Contacto', path: '/contacto' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex flex-col items-center group">
          <span className="font-display text-2xl tracking-[0.3em] uppercase group-hover:text-gold transition-colors duration-300">Cutaneo</span>
          <span className="text-[9px] tracking-[0.4em] uppercase text-gray-500 mt-1 group-hover:text-gray-900 transition-colors duration-300">Estética Avanzada</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`text-xs uppercase tracking-widest transition-colors duration-300 hover:text-gold ${
                location.pathname === link.path ? 'text-black font-medium' : 'text-gray-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/reservar" className="btn-primary ml-4">
            Reservar Turno
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-black p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div 
        className={`md:hidden fixed inset-0 bg-white z-40 transition-transform duration-500 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '72px' }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className="text-lg uppercase tracking-widest text-gray-800 hover:text-gold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/reservar" 
            className="btn-primary w-full text-center mt-8"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Reservar Turno
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
