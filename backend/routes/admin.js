const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const { sendCancellationEmail } = require('../emailService');

// Middleware de autenticación simple
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
};

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, token: process.env.ADMIN_PASSWORD });
  } else {
    res.status(401).json({ error: 'Contraseña incorrecta' });
  }
});

// GET /api/admin/appointments — Todos los turnos
router.get('/appointments', requireAdmin, async (req, res) => {
  try {
    const { date, search, status } = req.query;

    let query = supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });

    if (date) {
      query = query.eq('appointment_date', date);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Filtro por nombre/email en memoria
    let filtered = data;
    if (search) {
      const s = search.toLowerCase();
      filtered = data.filter(a =>
        a.first_name.toLowerCase().includes(s) ||
        a.last_name.toLowerCase().includes(s) ||
        a.email.toLowerCase().includes(s) ||
        a.phone.includes(s)
      );
    }

    res.json({ appointments: filtered });
  } catch (error) {
    console.error('Error al obtener turnos:', error);
    res.status(500).json({ error: 'Error al obtener turnos' });
  }
});

// PUT /api/admin/appointments/:id — Actualizar turno (reprogramar)
router.put('/appointments/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { appointment_date, appointment_time, status, notes } = req.body;

    // Si se reprograma, verificar disponibilidad
    if (appointment_date && appointment_time) {
      const { data: existing } = await supabase
        .from('appointments')
        .select('id')
        .eq('appointment_date', appointment_date)
        .eq('appointment_time', appointment_time)
        .eq('status', 'confirmed')
        .neq('id', id)
        .single();

      if (existing) {
        return res.status(409).json({ error: 'El horario seleccionado ya está ocupado' });
      }
    }

    const updateData = {};
    if (appointment_date) updateData.appointment_date = appointment_date;
    if (appointment_time) updateData.appointment_time = appointment_time;
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, appointment: data });
  } catch (error) {
    console.error('Error al actualizar turno:', error);
    res.status(500).json({ error: 'Error al actualizar el turno' });
  }
});

// DELETE /api/admin/appointments/:id — Cancelar turno
router.delete('/appointments/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !appointment) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) throw error;

    // Enviar email de cancelación
    sendCancellationEmail(appointment).catch(console.error);

    res.json({ success: true, message: 'Turno cancelado' });
  } catch (error) {
    console.error('Error al cancelar turno:', error);
    res.status(500).json({ error: 'Error al cancelar el turno' });
  }
});

// GET /api/admin/stats — Estadísticas
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: all } = await supabase.from('appointments').select('status, appointment_date');

    const total = all?.length || 0;
    const confirmed = all?.filter(a => a.status === 'confirmed').length || 0;
    const cancelled = all?.filter(a => a.status === 'cancelled').length || 0;
    const today_count = all?.filter(a => a.appointment_date === today && a.status === 'confirmed').length || 0;

    res.json({ total, confirmed, cancelled, today: today_count });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

module.exports = router;
