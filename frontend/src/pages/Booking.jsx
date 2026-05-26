import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Calendar from '../components/Calendar';
import TimeSlotPicker from '../components/TimeSlotPicker';
import BookingForm from '../components/BookingForm';
import SuccessModal from '../components/SuccessModal';
import { useAvailability } from '../hooks/useAvailability';
import { useBooking } from '../hooks/useBooking';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const { slots, isLoading: loadingSlots, isDayAvailable, message } = useAvailability(selectedDate);
  const { bookAppointment, isSubmitting, success, appointmentDetails } = useBooking();

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleSubmit = async (formData) => {
    try {
      await bookAppointment(formData);
    } catch (error) {
      toast.error(error.message || 'Ocurrió un error al reservar el turno');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="text-xs uppercase tracking-widest text-gold mb-2 block">Reservas</span>
            <h1 className="font-display text-4xl">Agenda tu Turno</h1>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Calendar & Time */}
            <div className="lg:col-span-5 space-y-8 animate-fade-in-up delay-100">
              <div className="bg-white p-8 border border-gray-100 shadow-sm">
                <h3 className="font-display text-xl mb-6 text-center">1. Elegí la Fecha</h3>
                <Calendar 
                  selectedDate={selectedDate} 
                  onSelectDate={handleDateSelect} 
                />
              </div>

              {selectedDate && (
                <div className="bg-white p-8 border border-gray-100 shadow-sm animate-fade-in">
                  <h3 className="font-display text-xl mb-2 text-center">2. Elegí el Horario</h3>
                  <p className="text-center text-xs text-gray-500 uppercase tracking-widest mb-6">
                    {format(new Date(selectedDate + 'T00:00:00'), 'EEEE d MMMM', { locale: es })}
                  </p>
                  
                  {!isDayAvailable && message && !loadingSlots ? (
                    <div className="text-center py-8 text-sm text-gray-500 bg-gray-50 border border-gray-100">
                      {message}
                    </div>
                  ) : (
                    <TimeSlotPicker 
                      slots={slots}
                      selectedTime={selectedTime}
                      onSelectTime={handleTimeSelect}
                      isLoading={loadingSlots}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-7 animate-fade-in-up delay-200">
              <div>
                <BookingForm 
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {success && (
        <SuccessModal 
          appointment={appointmentDetails} 
          onClose={() => window.location.href = '/'} 
        />
      )}
    </div>
  );
};

export default Booking;
