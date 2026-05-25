const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const { sendConfirmationEmail, sendCancellationEmail } = require('../emailService');
const { generateTimeSlots, isAllowedDay, isPastDate, isPastTime } = require('../availabilityService');

// GET /api/appointments/availability?date=YYYY-MM-DD
router.get('/availability', async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Se requiere una fecha' });
    }

    // Validar día permitido
    if (!isAllowedDay(date)) {
      return res.json({ available: false, slots: [], message: 'Día no disponible' });
    }

    // Validar fecha pasada
    if (isPastDate(date)) {
      return res.json({ available: false, slots: [], message: 'Fecha en el pasado' });
    }

    // Obtener turnos existentes para ese día
    const { data: bookedSlots, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', date)
      .eq('status', 'confirmed');

    if (error) throw error;

    const bookedTimes = bookedSlots.map(b => b.appointment_time.substring(0, 5));
    const allSlots = generateTimeSlots();

    const slots = allSlots.map(time => ({
      time,
      available: !bookedTimes.includes(time) && !isPastTime(date, time),
    }));

    res.json({ available: true, slots, date });
  } catch (error) {
    console.error('Error al obtener disponibilidad:', error);
    res.status(500).json({ error: 'Error al obtener disponibilidad' });
  }
});

// POST /api/appointments — Crear turno
router.post('/', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      phone,
      email,
      appointment_date,
      appointment_time,
      treatment_zone,
      had_laser_before,
      knows_treatment,
    } = req.body;

    // Validaciones básicas
    if (!first_name || !last_name || !phone || !email || !appointment_date || !appointment_time || !treatment_zone) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben completarse' });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Validar día permitido
    if (!isAllowedDay(appointment_date)) {
      return res.status(400).json({ error: 'El día seleccionado no está disponible' });
    }

    // Validar fecha pasada
    if (isPastDate(appointment_date)) {
      return res.status(400).json({ error: 'No se pueden reservar turnos en fechas pasadas' });
    }

    // Validar horario pasado
    if (isPastTime(appointment_date, appointment_time)) {
      return res.status(400).json({ error: 'El horario seleccionado ya pasó' });
    }

    // Verificar disponibilidad del slot
    const { data: existing, error: checkError } = await supabase
      .from('appointments')
      .select('id')
      .eq('appointment_date', appointment_date)
      .eq('appointment_time', appointment_time + ':00')
      .eq('status', 'confirmed')
      .single();

    if (checkError && checkError.code !== 'PGRST116') throw checkError;

    if (existing) {
      return res.status(409).json({ error: 'El horario seleccionado ya no está disponible' });
    }

    // Crear turno
    const { data: appointment, error: insertError } = await supabase
      .from('appointments')
      .insert({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        appointment_date,
        appointment_time: appointment_time + ':00',
        treatment_zone: treatment_zone.trim(),
        had_laser_before: Boolean(had_laser_before),
        knows_treatment: Boolean(knows_treatment),
        status: 'confirmed',
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Enviar email de confirmación (no bloqueante)
    sendConfirmationEmail(appointment, appointment.cancel_token).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Turno reservado exitosamente',
      appointment: {
        id: appointment.id,
        first_name: appointment.first_name,
        last_name: appointment.last_name,
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time,
        treatment_zone: appointment.treatment_zone,
      },
    });
  } catch (error) {
    console.error('Error al crear turno:', error);
    res.status(500).json({ error: 'Error al crear el turno' });
  }
});

// GET /api/appointments/cancel/:token — Cancelar turno por token
router.get('/cancel/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const { data: appointment, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('cancel_token', token)
      .single();

    if (error || !appointment) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ error: 'Este turno ya fue cancelado anteriormente' });
    }

    // Cancelar el turno
    const { error: updateError } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('cancel_token', token);

    if (updateError) throw updateError;

    // Enviar email de cancelación
    sendCancellationEmail(appointment).catch(console.error);

    res.json({
      success: true,
      message: 'Turno cancelado exitosamente',
      appointment: {
        first_name: appointment.first_name,
        last_name: appointment.last_name,
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time,
      },
    });
  } catch (error) {
    console.error('Error al cancelar turno:', error);
    res.status(500).json({ error: 'Error al cancelar el turno' });
  }
});

module.exports = router;
