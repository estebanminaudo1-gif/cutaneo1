// Días permitidos: Lunes=1, Martes=2, Jueves=4, Viernes=5
const ALLOWED_DAYS = [1, 2, 4, 5];

// Horario: 12:00 - 20:00 (último turno 19:30 para que termine a las 20:00)
const FIRST_SLOT_HOUR = 12;
const LAST_SLOT_HOUR = 20;
const SLOT_DURATION_MINUTES = 30;

/**
 * Genera todos los slots de tiempo posibles para un día
 */
const generateTimeSlots = () => {
  const slots = [];
  let hour = FIRST_SLOT_HOUR;
  let minute = 0;

  while (hour < LAST_SLOT_HOUR) {
    const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    slots.push(timeStr);
    minute += SLOT_DURATION_MINUTES;
    if (minute >= 60) {
      minute -= 60;
      hour += 1;
    }
  }

  return slots;
};

/**
 * Verifica si una fecha tiene un día permitido
 * @param {string} dateStr - Fecha en formato YYYY-MM-DD
 */
const isAllowedDay = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay(); // 0=Dom, 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb
  return ALLOWED_DAYS.includes(dayOfWeek);
};

/**
 * Verifica si una fecha es en el pasado
 */
const isPastDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Verifica si un horario ya pasó para hoy
 */
const isPastTime = (dateStr, timeStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  const slotDate = new Date(year, month - 1, day, hour, minute);
  return slotDate <= new Date();
};

module.exports = {
  ALLOWED_DAYS,
  generateTimeSlots,
  isAllowedDay,
  isPastDate,
  isPastTime,
};
