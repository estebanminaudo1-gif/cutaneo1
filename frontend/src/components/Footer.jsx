import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex flex-col items-start mb-6">
              <span className="font-display text-2xl tracking-[0.3em] uppercase text-white">Cutaneo</span>
              <span className="text-[9px] tracking-[0.4em] uppercase text-gold mt-1">Estética Avanzada</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              Especialistas en depilación láser y tratamientos estéticos de vanguardia. Resultados visibles desde la primera sesión con tecnología de última generación.
            </p>
            <div className="flex gap-4">
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white font-medium mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Inicio</Link></li>
              <li><Link to="/tratamiento" className="text-gray-400 hover:text-white transition-colors text-sm">Tratamientos</Link></li>
              <li><Link to="/reservar" className="text-gray-400 hover:text-white transition-colors text-sm">Reservar Turno</Link></li>
              <li><Link to="/contacto" className="text-gray-400 hover:text-white transition-colors text-sm">Contacto</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white font-medium mb-6">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-gold mt-0.5" />
                <span className="text-gray-400 text-sm">Av. Libertador 1234, Piso 5<br/>CABA, Argentina</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-gold" />
                <span className="text-gray-400 text-sm">+54 9 11 1234-5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gold" />
                <span className="text-gray-400 text-sm">turnos@cutaneo.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} Cutaneo. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link to="/admin" className="text-gray-600 hover:text-white transition-colors text-xs">Acceso Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
