import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1616394584738-1d4464b29c01?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Spa treatment" 
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-2xl animate-fade-in-up">
              <span className="text-gold tracking-[0.2em] uppercase text-xs font-semibold mb-4 block">Centro de Estética</span>
              <h1 className="font-display text-5xl md:text-7xl leading-tight mb-6">
                Descubrí tu <br/>mejor versión.
              </h1>
              <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-lg font-light leading-relaxed">
                Especialistas en depilación láser definitiva. Resultados visibles desde la primera sesión con tecnología premium.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/reservar" className="btn-primary">
                  Reservar Turno <ArrowRight size={16} />
                </Link>
                <Link to="/tratamiento" className="btn-outline">
                  Conocer Tratamientos
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up delay-100">
              <span className="text-xs uppercase tracking-widest text-gold mb-2 block">Por qué elegirnos</span>
              <h2 className="font-display text-3xl md:text-4xl">La Experiencia Cutaneo</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center p-8 bg-white border border-gray-100 shadow-sm animate-fade-in-up delay-200 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
                  <Star size={24} />
                </div>
                <h3 className="font-display text-xl mb-4">Tecnología Premium</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Utilizamos equipos de última generación para garantizar resultados efectivos y seguros en todos los tipos de piel.
                </p>
              </div>
              
              <div className="text-center p-8 bg-white border border-gray-100 shadow-sm animate-fade-in-up delay-300 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-display text-xl mb-4">Profesionales</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Nuestro equipo está altamente capacitado y certificado para brindarte la mejor atención personalizada.
                </p>
              </div>
              
              <div className="text-center p-8 bg-white border border-gray-100 shadow-sm animate-fade-in-up delay-400 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
                  <Clock size={24} />
                </div>
                <h3 className="font-display text-xl mb-4">Resultados Rápidos</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Notarás cambios desde la primera sesión. Tratamientos rápidos, indoloros y altamente efectivos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section bg-black text-white text-center">
          <div className="container mx-auto max-w-3xl">
            <h2 className="font-display text-4xl mb-6">¿Lista para empezar?</h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto">
              Reservá tu turno online en minutos. Elegí el día y horario que mejor se adapte a tu rutina.
            </p>
            <Link to="/reservar" className="btn-gold">
              Agendar Mi Sesión
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
