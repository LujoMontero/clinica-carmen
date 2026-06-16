import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerCitas, actualizarEstadoCita } from '../firebase';

const ESTADOS = ['confirmada', 'completada', 'cancelada'];
const TRATAMIENTOS = [
  'Limpiezas Faciales', 'Botox', 'Bioestimuladores', 'Sueroterapia',
  'Mesoterapia con Vitaminas', 'Rinomodelación', 'Lips Glow'
];

export default function AdminPanel() {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroTratamiento, setFiltroTratamiento] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const navigate = useNavigate();

  const hoy = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const unsubscribe = obtenerCitas((data) => {
      setCitas(data);
      setCargando(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const handleCambiarEstado = async (citaId, estadoActual) => {
    const siguienteIndex = (ESTADOS.indexOf(estadoActual) + 1) % ESTADOS.length;
    const nuevoEstado = ESTADOS[siguienteIndex];
    await actualizarEstadoCita(citaId, nuevoEstado);
  };

  const citasFiltradas = citas.filter((c) => {
    if (filtroFecha && c.fecha !== filtroFecha) return false;
    if (filtroTratamiento && c.tratamiento !== filtroTratamiento) return false;
    if (filtroEstado && c.estado !== filtroEstado) return false;
    return true;
  });

  const citasHoy = citas.filter((c) => c.fecha === hoy).length;

  const exportarCSV = () => {
    const headers = ['ID', 'Fecha', 'Hora', 'Paciente', 'Email', 'Teléfono', 'Tratamiento', 'Estado', 'Registrado'];
    const rows = citasFiltradas.map((c) => [
      c.id, c.fecha, c.horario, c.nombre, c.correo, c.telefono, c.tratamiento, c.estado,
      c.creadoEn?.toLocaleString?.('es-CL') || ''
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citas-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getEstadoColor = (estado) => {
    if (estado === 'confirmada') return 'bg-amber-100 text-amber-700';
    if (estado === 'completada') return 'bg-green-100 text-green-700';
    if (estado === 'cancelada') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-[#f5ede0]">
      {/* Header */}
      <div className="bg-[#4a3728] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-lg">Registro de Citas</h1>
          <p className="text-white/60 text-xs">Dra. Carmen Montero</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-[#c9a882] text-[#4a3728] px-3 py-1.5 rounded-lg text-xs font-semibold">
            Hoy: {citasHoy} citas
          </span>
          <button
            onClick={exportarCSV}
            className="bg-[#c9a882] text-[#4a3728] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#b8966e] transition-all"
          >
            Exportar CSV
          </button>
          <button
            onClick={handleLogout}
            className="border border-white/30 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-all"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="px-6 py-4 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
          <div>
            <label className="text-xs font-medium text-[#7a6152] block mb-1">Fecha</label>
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#c9a882] focus:ring-2 focus:ring-[#c9a882]/20"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#7a6152] block mb-1">Tratamiento</label>
            <select
              value={filtroTratamiento}
              onChange={(e) => setFiltroTratamiento(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#c9a882] focus:ring-2 focus:ring-[#c9a882]/20 bg-white"
            >
              <option value="">Todos</option>
              {TRATAMIENTOS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[#7a6152] block mb-1">Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#c9a882] focus:ring-2 focus:ring-[#c9a882]/20 bg-white"
            >
              <option value="">Todos</option>
              {ESTADOS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => { setFiltroFecha(''); setFiltroTratamiento(''); setFiltroEstado(''); }}
            className="mt-5 text-xs text-[#7a6152] hover:text-[#4a3728] underline"
          >
            Limpiar filtros
          </button>
          <span className="mt-5 ml-auto text-xs text-[#7a6152]">
            Mostrando {citasFiltradas.length} de {citas.length} citas
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className="px-6 pb-6 max-w-7xl mx-auto">
        {cargando ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-[#c9a882] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-[#7a6152]">Cargando citas...</p>
          </div>
        ) : citasFiltradas.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <p className="text-[#7a6152] text-lg">No hay citas que coincidan</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#4a3728] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Fecha</th>
                    <th className="px-4 py-3 text-left font-medium">Hora</th>
                    <th className="px-4 py-3 text-left font-medium">Paciente</th>
                    <th className="px-4 py-3 text-left font-medium">Teléfono</th>
                    <th className="px-4 py-3 text-left font-medium">Correo</th>
                    <th className="px-4 py-3 text-left font-medium">Tratamiento</th>
                    <th className="px-4 py-3 text-left font-medium">Estado</th>
                    <th className="px-4 py-3 text-left font-medium">Registrado</th>
                    <th className="px-4 py-3 text-left font-medium">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {citasFiltradas.map((cita) => (
                    <tr key={cita.id} className="hover:bg-[#f5ede0]/50 transition-colors">
                      <td className="px-4 py-3 text-[#4a3728] font-medium whitespace-nowrap">{cita.fecha}</td>
                      <td className="px-4 py-3 text-[#4a3728]">{cita.horario}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#4a3728]">{cita.nombre}</div>
                      </td>
                      <td className="px-4 py-3 text-[#7a6152]">{cita.telefono}</td>
                      <td className="px-4 py-3 text-[#7a6152] text-xs">{cita.correo}</td>
                      <td className="px-4 py-3">
                        <span className="bg-[#c9a882]/20 text-[#4a3728] px-2 py-1 rounded-md text-xs font-medium">
                          {cita.tratamiento}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getEstadoColor(cita.estado)}`}>
                          {cita.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#7a6152] whitespace-nowrap">
                        {cita.creadoEn?.toLocaleString?.('es-CL', {
                          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                        }) || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleCambiarEstado(cita.id, cita.estado)}
                          className="text-xs bg-[#4a3728] text-white px-3 py-1.5 rounded-lg hover:bg-[#3a2a1e] transition-all"
                        >
                          Cambiar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}