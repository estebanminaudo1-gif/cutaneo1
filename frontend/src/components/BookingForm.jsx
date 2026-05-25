import { useState } from 'react';
import toast from 'react-hot-toast';

const BookingForm = ({ 
  selectedDate, 
  selectedTime, 
  onSubmit, 
  isSubmitting 
}) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    treatment_zone: '',
    had_laser_before: false,
    knows_treatment: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      toast.error('Por favor seleccioná fecha y hora para tu turno.');
      return;
    }

    if (!formData.first_name || !formData.last_name || !formData.phone || !formData.email || !formData.treatment_zone) {
      toast.error('Por favor completá todos los campos obligatorios.');
      return;
    }

    onSubmit({
      ...formData,
      appointment_date: selectedDate,
      appointment_time: selectedTime,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 border border-gray-100 shadow-sm">
      <h3 className="font-display text-xl mb-8 text-center">Tus Datos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="input-label" htmlFor="first_name">Nombre *</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="input-field"
            placeholder="Tu nombre"
            required
          />
        </div>
        <div>
          <label className="input-label" htmlFor="last_name">Apellido *</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="input-field"
            placeholder="Tu apellido"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="input-label" htmlFor="phone">Celular *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-field"
            placeholder="+54 9 11..."
            required
          />
        </div>
        <div>
          <label className="input-label" htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            placeholder="tu@email.com"
            required
          />
        </div>
      </div>

      <div className="mb-8">
        <label className="input-label" htmlFor="treatment_zone">¿Qué zona te vas a depilar? *</label>
        <input
          type="text"
          id="treatment_zone"
          name="treatment_zone"
          value={formData.treatment_zone}
          onChange={handleChange}
          className="input-field"
          placeholder="Ej: Piernas enteras, axilas, bozo..."
          required
        />
      </div>

      <div className="space-y-6 mb-10">
        <div>
          <label className="input-label mb-3">¿Te depilaste anteriormente con láser?</label>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                id="laser_yes"
                name="had_laser_before"
                checked={formData.had_laser_before === true}
                onChange={() => handleRadioChange('had_laser_before', true)}
              />
              <label htmlFor="laser_yes">SÍ</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="laser_no"
                name="had_laser_before"
                checked={formData.had_laser_before === false}
                onChange={() => handleRadioChange('had_laser_before', false)}
              />
              <label htmlFor="laser_no">NO</label>
            </div>
          </div>
        </div>

        <div>
          <label className="input-label mb-3">¿Conocés el tratamiento?</label>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                id="knows_yes"
                name="knows_treatment"
                checked={formData.knows_treatment === true}
                onChange={() => handleRadioChange('knows_treatment', true)}
              />
              <label htmlFor="knows_yes">SÍ</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="knows_no"
                name="knows_treatment"
                checked={formData.knows_treatment === false}
                onChange={() => handleRadioChange('knows_treatment', false)}
              />
              <label htmlFor="knows_no">NO</label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 border border-gray-100 mb-8 text-sm text-gray-600 text-center">
        Al confirmar, recibirás un email con los detalles de tu turno.
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !selectedDate || !selectedTime}
        className={`w-full btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'Procesando...' : 'Confirmar Turno'}
      </button>
    </form>
  );
};

export default BookingForm;
