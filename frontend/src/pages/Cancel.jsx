import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, XCircle, AlertTriangle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Cancel = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const cancelAppointment = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/appointments/cancel/${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setAppointment(data.appointment);
        } else {
          setStatus('error');
          setMessage(data.error);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Ocurrió un error al intentar cancelar el turno. Por favor, contactate con nosotros.');
      }
    };

    if (token) {
      cancelAppointment();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-4">
        <div className="bg-white max-w-md w-full p-10 border border-gray-100 shadow-sm text-center animate-fade-in-up">
          
          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-6"></div>
              <h2 className="font-display text-2xl mb-2">Procesando...</h2>
              <p className="text-gray-500 text-sm">Estamos cancelando tu turno.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="w-16 h-16 bg-gray-50 text-black rounded-full flex items-center justify-center mb-6">
                <Check size={32} />
              </div>
              <h2 className="font-display text-2xl mb-2">Turno Cancelado</h2>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                El turno a nombre de <strong>{appointment?.first_name}</strong> ha sido cancelado exitosamente. Te enviamos un email de confirmación.
              </p>
              <Link to="/reservar" className="btn-primary w-full">
                Reservar Nuevo Turno
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                {message.includes('ya fue cancelado') ? <AlertTriangle size={32} /> : <XCircle size={32} />}
              </div>
              <h2 className="font-display text-2xl mb-2">Atención</h2>
              <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                {message}
              </p>
              <Link to="/" className="btn-outline w-full mb-4">
                Volver al Inicio
              </Link>
              <a href="mailto:turnos@cutaneo.com" className="text-xs text-gray-500 underline hover:text-black transition-colors">
                Contactar Soporte
              </a>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cancel;
