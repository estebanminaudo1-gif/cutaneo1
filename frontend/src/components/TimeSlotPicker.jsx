const TimeSlotPicker = ({ slots, selectedTime, onSelectTime, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-6 animate-pulse">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded"></div>
        ))}
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 border border-gray-100 mt-6">
        <p className="text-gray-500 text-sm">Seleccioná una fecha para ver los horarios disponibles.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-xs font-medium uppercase tracking-widest text-gray-800 mb-4 text-center">
        Horarios Disponibles
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {slots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            onClick={() => onSelectTime(slot.time)}
            className={`time-slot ${!slot.available ? 'disabled' : ''} ${
              selectedTime === slot.time ? 'selected' : ''
            }`}
          >
            {slot.time} hs
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotPicker;
