import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const useAvailability = (selectedDate) => {
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDayAvailable, setIsDayAvailable] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!selectedDate) return;

    const fetchAvailability = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${API_URL}/appointments/availability?date=${selectedDate}`);
        if (!response.ok) {
          throw new Error('Error fetching availability');
        }
        
        const data = await response.json();
        setSlots(data.slots || []);
        setIsDayAvailable(data.available);
        setMessage(data.message || '');
      } catch (err) {
        setError(err.message);
        setIsDayAvailable(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [selectedDate]);

  return { slots, isLoading, error, isDayAvailable, message };
};
