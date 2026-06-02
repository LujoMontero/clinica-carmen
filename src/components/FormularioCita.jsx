import { useState } from 'react'
import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_4og8nts'
const TEMPLATE_CLIENTE = 'template_bmqcoc7'
const TEMPLATE_DOCTOR = 'template_lu9k4r7'
const PUBLIC_KEY = 'Jguslyt-t5XNGcNi3'

const especialidades = [
  { icon: '🫀', nombre: 'Medicina General' },
  { icon: '🧠', nombre: 'Neurología' },
  { icon: '🦷', nombre: 'Odontología' },
  { icon: '👶', nombre: 'Pediatría' },
  { icon: '👁️', nombre: 'Oftalmología' },
  { icon: '🦴', nombre: 'Traumatología' },
]

const horarios = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00']

function getDias() {
  const dias = []
  const hoy = new Date()
  for (let i = 1; i <= 30; i++) {
    const d = new Date(hoy)
    d.setDate(hoy.getDate() + i)
    if (d.getDay() !== 0) {
      dias.push(d)
    }
    if (dias.length === 14) break
  }
  return dias
}

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export default function FormularioCita({ abierto, onCerrar }) {
  const [paso, setPaso] = useState(1)
  const [form, setForm] = useState({ especialidad: '', dia: null, horario: '', nombre: '', telefono: '', correo: '' })
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  const dias = getDias()

  if (!abierto) return null

  const handleCerrar = () => {
    setPaso(1)
    setForm({ especialidad: '', dia: null, horario: '', nombre: '', telefono: '', correo: '' })
    setEnviado(false)
    setError('')
    onCerrar()
  }

  const handleSubmit = async () => {
    if (!form.nombre || !form.telefono || !form.correo) {
      setError('Por favor completa todos los campos.')
      return
    }
    setError('')
    setEnviando(true)
    const diaStr = form.dia ? `${DIAS_SEMANA[form.dia.getDay()]} ${form.dia.getDate()} de ${MESES[form.dia.getMonth()]}` : ''
    const params = {
      nombre: form.nombre,
      telefono: form.telefono,
      correo_cliente: form.correo,
      especialidad: form.especialidad,
      dia: diaStr,
      horario: form.horario,
    }
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_CLIENTE, params, PUBLIC_KEY)
      await emailjs.send(SERVICE_ID, TEMPLATE_DOCTOR, params, PUBLIC_KEY)
      setEnviado(true)
    } catch {
      setError('Hubo un problema al enviar. Llámanos al +56 9 1234 5678.')
    }
    setEnviando(false)
  }

  const titulos = ['', 'Especialidad', 'Fecha', 'Horario', 'Tus datos', 'Confirmación']

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4" onClick={handleCerrar}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-[#0b5e4a] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-base">
              {enviado ? '¡Cita confirmada!' : `Paso ${paso} de 4 — ${titulos[paso]}`}
            </h2>
            <p className="text-white/60 text-xs mt-0.5">Clínica Salud Integral</p>
          </div>
          <button onClick={handleCerrar} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
        </div>

        {/* Barra de progreso */}
        {!enviado && (
          <div className="flex h-1">
            {[1,2,3,4].map(n => (
              <div key={n} className={`flex-1 transition-colors ${n <= paso ? 'bg-[#0f6e56]' : 'bg-gray-200'}`} />
            ))}
          </div>
        )}

        {/* Contenido */}
        <div className="px-6 py-6">

          {/* Enviado */}
          {enviado && (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">¡Todo listo, {form.nombre.split(' ')[0]}!</h3>
              <p className="text-sm text-gray-500 mb-4">Te enviamos la confirmación a <span className="text-[#0f6e56] font-medium">{form.correo}</span></p>
              <div className="bg-gray-50 rounded-xl p-4 text-left text-sm text-gray-600 flex flex-col gap-2 mb-6">
                <div className="flex justify-between"><span className="text-gray-400">Especialidad</span><span className="font-medium">{form.especialidad}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Fecha</span><span className="font-medium">{DIAS_SEMANA[form.dia.getDay()]} {form.dia.getDate()} {MESES[form.dia.getMonth()]}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Horario</span><span className="font-medium">{form.horario} hrs</span></div>
              </div>
              <button onClick={handleCerrar} className="bg-[#0f6e56] text-white px-8 py-2.5 rounded-full text-sm font-medium hover:bg-[#085041] transition-colors">
                Cerrar
              </button>
            </div>
          )}

          {/* Paso 1 — Especialidad */}
          {!enviado && paso === 1 && (
            <div>
              <p className="text-sm text-gray-500 mb-4">¿Qué especialidad necesitas?</p>
              <div className="grid grid-cols-2 gap-3">
                {especialidades.map(e => (
                  <button
                    key={e.nombre}
                    onClick={() => { setForm({...form, especialidad: e.nombre}); setPaso(2) }}
                    className={`flex items-center gap-3 border rounded-xl px-4 py-3 text-sm font-medium transition-colors text-left
                      ${form.especialidad === e.nombre ? 'border-[#0f6e56] bg-[#0f6e56]/5 text-[#0f6e56]' : 'border-gray-200 text-gray-700 hover:border-[#0f6e56]/50'}`}
                  >
                    <span className="text-xl">{e.icon}</span>
                    {e.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 2 — Fecha */}
          {!enviado && paso === 2 && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Selecciona un día disponible</p>
              <div className="grid grid-cols-4 gap-2">
                {dias.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => { setForm({...form, dia: d}); setPaso(3) }}
                    className={`flex flex-col items-center py-3 rounded-xl border text-sm transition-colors
                      ${form.dia && form.dia.toDateString() === d.toDateString()
                        ? 'border-[#0f6e56] bg-[#0f6e56] text-white'
                        : 'border-gray-200 text-gray-700 hover:border-[#0f6e56]/50'}`}
                  >
                    <span className="text-xs text-inherit opacity-70">{DIAS_SEMANA[d.getDay()]}</span>
                    <span className="font-semibold text-base">{d.getDate()}</span>
                    <span className="text-xs text-inherit opacity-70">{MESES[d.getMonth()].slice(0,3)}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setPaso(1)} className="mt-4 text-xs text-gray-400 hover:text-gray-600">← Volver</button>
            </div>
          )}

          {/* Paso 3 — Horario */}
          {!enviado && paso === 3 && (
            <div>
              <p className="text-sm text-gray-500 mb-4">¿A qué hora te acomoda?</p>
              <div className="grid grid-cols-3 gap-2">
                {horarios.map(h => (
                  <button
                    key={h}
                    onClick={() => { setForm({...form, horario: h}); setPaso(4) }}
                    className={`py-3 rounded-xl border text-sm font-medium transition-colors
                      ${form.horario === h
                        ? 'border-[#0f6e56] bg-[#0f6e56] text-white'
                        : 'border-gray-200 text-gray-700 hover:border-[#0f6e56]/50'}`}
                  >
                    {h} hrs
                  </button>
                ))}
              </div>
              <button onClick={() => setPaso(2)} className="mt-4 text-xs text-gray-400 hover:text-gray-600">← Volver</button>
            </div>
          )}

          {/* Paso 4 — Datos personales */}
          {!enviado && paso === 4 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-500">Ingresa tus datos de contacto</p>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Nombre completo</label>
                <input
                  value={form.nombre}
                  onChange={e => setForm({...form, nombre: e.target.value})}
                  placeholder="Juan Pérez"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0f6e56] transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Teléfono</label>
                <input
                  value={form.telefono}
                  onChange={e => setForm({...form, telefono: e.target.value})}
                  placeholder="+56 9 1234 5678"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0f6e56] transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Correo electrónico</label>
                <input
                  value={form.correo}
                  onChange={e => setForm({...form, correo: e.target.value})}
                  placeholder="correo@gmail.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0f6e56] transition-colors"
                />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <div className="flex gap-3 mt-1">
                <button onClick={() => setPaso(3)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  ← Volver
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={enviando}
                  className="flex-1 bg-[#0f6e56] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#085041] transition-colors disabled:opacity-50"
                >
                  {enviando ? 'Enviando...' : 'Confirmar cita'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}