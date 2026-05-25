import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, LogOut, Trash2, Calendar as CalendarIcon, Users, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Admin = () => {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, cancelled: 0, today: 0 });
  const [filters, setFilters] = useState({ search: '', status: 'all', date: '' });

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, filters]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
        toast.success('Sesión iniciada');
      } else {
        toast.error(data.error || 'Contraseña incorrecta');
      }
    } catch (err) {
      toast.error('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setAppointments([]);
  };

  const fetchData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.ok) setStats(await statsRes.json());

      // Fetch appointments
      const query = new URLSearchParams(filters).toString();
      const appsRes = await fetch(`${API_URL}/admin/appointments?${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (appsRes.status === 401) {
        handleLogout();
        return;
      }
      
      if (appsRes.ok) {
        const data = await appsRes.json();
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar datos');
    }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm('¿Estás seguro de cancelar este turno? Se enviará un email al cliente.')) return;

    try {
      const res = await fetch(`${API_URL}/admin/appointments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success('Turno cancelado');
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } catch (err) {
      toast.error('Error al cancelar');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-10 shadow-sm border border-gray-100 max-w-sm w-full animate-fade-in-up">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl tracking-[0.2em] uppercase mb-2">Cutaneo</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Panel de Control</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="input-label">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full">
              {isLoading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>
          <div className="mt-8 text-center">
            <a href="/" className="text-xs text-gray-500 hover:text-black transition-colors">← Volver al sitio web</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-xl tracking-[0.2em] uppercase">Cutaneo</h1>
          <span className="bg-black text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm">Admin</span>
        </div>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-black flex items-center gap-2 transition-colors">
          <LogOut size={16} /> Salir
        </button>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
          <div className="bg-white p-6 border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 text-black flex items-center justify-center rounded-full"><Users size={24}/></div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Turnos</p>
              <p className="text-2xl font-medium">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white p-6 border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 flex items-center justify-center rounded-full"><CheckCircle size={24}/></div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Confirmados</p>
              <p className="text-2xl font-medium">{stats.confirmed}</p>
            </div>
          </div>
          <div className="bg-white p-6 border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 flex items-center justify-center rounded-full"><XCircle size={24}/></div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Cancelados</p>
              <p className="text-2xl font-medium">{stats.cancelled}</p>
            </div>
          </div>
          <div className="bg-white p-6 border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-gold/10 text-gold-dark flex items-center justify-center rounded-full"><CalendarIcon size={24}/></div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Hoy</p>
              <p className="text-2xl font-medium">{stats.today}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-end animate-fade-in-up delay-100">
          <div className="flex-1 min-w-[200px]">
            <label className="input-label">Buscar cliente</label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Nombre, email o teléfono..." 
                className="input-field pl-10 py-2 text-sm"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="input-label">Fecha</label>
            <input 
              type="date" 
              className="input-field py-2 text-sm"
              value={filters.date}
              onChange={(e) => setFilters({...filters, date: e.target.value})}
            />
          </div>
          <div>
            <label className="input-label">Estado</label>
            <select 
              className="input-field py-2 text-sm"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">Todos</option>
              <option value="confirmed">Confirmados</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
          <button 
            onClick={() => setFilters({ search: '', status: 'all', date: '' })}
            className="btn-outline py-2 px-4"
          >
            Limpiar Filtros
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto animate-fade-in-up delay-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha / Hora</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Cliente</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Contacto</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Tratamiento</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">No se encontraron turnos con los filtros actuales.</td>
                </tr>
              ) : (
                appointments.map((app) => {
                  const dateObj = new Date(app.appointment_date + 'T00:00:00');
                  const isCancelled = app.status === 'cancelled';
                  
                  return (
                    <tr key={app.id} className={`hover:bg-gray-50 transition-colors ${isCancelled ? 'opacity-60 bg-gray-50/50' : ''}`}>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{format(dateObj, 'dd/MM/yyyy')}</div>
                        <div className="text-sm text-gray-500">{app.appointment_time.substring(0, 5)} hs</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{app.first_name} {app.last_name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {app.had_laser_before ? 'Con experiencia previa' : 'Primera vez'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{app.phone}</div>
                        <div className="text-sm text-gray-500">{app.email}</div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {app.treatment_zone}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isCancelled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {isCancelled ? 'Cancelado' : 'Confirmado'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {!isCancelled && (
                          <button 
                            onClick={() => cancelAppointment(app.id)}
                            className="text-red-600 hover:text-red-900 transition-colors p-2 rounded-full hover:bg-red-50"
                            title="Cancelar turno"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Admin;
