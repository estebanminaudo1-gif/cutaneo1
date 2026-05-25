import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isBefore, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const ALLOWED_DAYS = [1, 2, 4, 5]; // Lun, Mar, Jue, Vie

const Calendar = ({ selectedDate, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfToday();

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => {
    const prev = subMonths(currentMonth, 1);
    if (!isBefore(prev, startOfMonth(today))) {
      setCurrentMonth(prev);
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-6">
        <button 
          type="button"
          onClick={prevMonth}
          disabled={isSameMonth(currentMonth, today)}
          className={`p-2 rounded-full transition-colors ${
            isSameMonth(currentMonth, today) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-sm font-medium uppercase tracking-widest">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h3>
        <button 
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 }); // Start on Monday

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-4">
          {format(addDays(startDate, i), 'EE', { locale: es })}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        
        const isPast = isBefore(day, today);
        const isAllowedDay = ALLOWED_DAYS.includes(day.getDay());
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isDisabled = isPast || !isAllowedDay || !isCurrentMonth;
        const isSelected = selectedDate && isSameDay(day, new Date(selectedDate + 'T00:00:00'));
        const isToday = isSameDay(day, today);

        days.push(
          <div
            key={day.toString()}
            className={`calendar-day ${!isCurrentMonth ? 'invisible' : ''} ${
              isDisabled ? 'disabled' : 'available'
            } ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
            onClick={() => {
              if (!isDisabled) {
                onSelectDate(format(cloneDay, 'yyyy-MM-dd'));
              }
            }}
          >
            <span>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1 mb-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="bg-white border border-gray-100 p-6 shadow-sm">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-black"></div>
          <span>Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-200"></div>
          <span>No disponible</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
