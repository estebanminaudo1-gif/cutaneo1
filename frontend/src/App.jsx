import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Cancel from './pages/Cancel';
import Admin from './pages/Admin';

// Placeholder for missing pages to prevent errors
const Treatment = () => (
  <div className="min-h-screen flex items-center justify-center pt-20">
    <div className="text-center">
      <h1 className="font-display text-4xl mb-4">Tratamientos</h1>
      <p className="text-gray-500">Página en construcción.</p>
    </div>
  </div>
);

const Contact = () => (
  <div className="min-h-screen flex items-center justify-center pt-20">
    <div className="text-center">
      <h1 className="font-display text-4xl mb-4">Contacto</h1>
      <p className="text-gray-500">Página en construcción.</p>
    </div>
  </div>
);

function App() {
  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '0',
            background: '#0a0a0a',
            color: '#fff',
            padding: '16px 24px',
          },
          success: {
            iconTheme: {
              primary: '#C9A882',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservar" element={<Booking />} />
        <Route path="/cancelar/:token" element={<Cancel />} />
        <Route path="/tratamiento" element={<Treatment />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

export default App;
