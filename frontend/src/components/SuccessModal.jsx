import { Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const SuccessModal = ({ appointment, onClose }) => {
  if (!appointment) return null;

  // Asegurarnos de que appointment_date sea un objeto Date válido
  const dateObj = new Date(appointment.appointment_date + 'T00:00:00');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white max-w-md w-full p-8 shadow-2xl relative animate-fade-in-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
            <Check size={32} />
          </div>
          
          <h2 className="font-display text-2xl mb-2">¡Turno Confirmado!</h2>
          <p className="text-gray-600 mb-8">
            Hola {appointment.first_name}, tu reserva se realizó con éxito. Te enviamos un email con los detalles.
          </p>

          <div className="w-full bg-gray-50 border border-gray-100 p-6 mb-8 text-left">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Fecha</span>
                <span className="text-sm font-medium capitalize">
                  {format(dateObj, 'EEEE d MMMM', { locale: es })}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Hora</span>
                <span className="text-sm font-medium">{appointment.appointment_time.substring(0, 5)} hs</span>
              </div>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Zona a tratar</span>
              <span className="text-sm font-medium">{appointment.treatment_zone}</span>
            </div>
          </div>

          <button onClick={onClose} className="btn-primary w-full">
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
