import { useState, useEffect, useCallback } from "react";
import emailjs from "@emailjs/browser";
import { agendarCitaFirestore, verificarHorarioDisponible } from "../firebase";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_CLIENTE = import.meta.env.VITE_EMAILJS_TEMPLATE_CLIENTE;
const TEMPLATE_DOCTOR = import.meta.env.VITE_EMAILJS_TEMPLATE_DOCTOR;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const RATE_LIMIT_MS = 120000; // 2 minutos exactos

const tratamientos = [
  {
    icon: "✨",
    nombre: "Limpiezas Faciales",
    tieneSubopciones: false,
  },
  {
    icon: "💉",
    nombre: "Botox",
    tieneSubopciones: true,
    subopciones: [
      {
        nombre: "Toxina Botulínica (Reage, Nabota) 3 zonas",
        precio: "$179.990",
      },
      { nombre: "Toxina Botulínica para el bruxismo", precio: "$250.000" },
      {
        nombre: "Toxina Botulínica + Ácido Hialurónico (1ml)",
        precio: "$400.000",
      },
      {
        nombre: "Toxina Botulínica + Mesoterapia en rostro",
        precio: "$199.990",
      },
    ],
  },
  {
    icon: "💧",
    nombre: "Ácido Hialurónico",
    tieneSubopciones: true,
    subopciones: [
      { nombre: "Relleno de labios con ácido hialurónico", precio: "$250.000" },
      { nombre: "Relleno de mentón con ácido hialurónico", precio: "$250.000" },
      {
        nombre: "Relleno de pómulos con ácido hialurónico",
        precio: "$250.000",
      },
      { nombre: "Rinomodelación con ácido hialurónico", precio: "$350.000" },
      { nombre: "Rinolips (rinomodelación + labios)", precio: "$500.000" },
      { nombre: "Ácido hialurónico + Mesoterapia", precio: "$289.990" },
    ],
  },
  {
    icon: "🌿",
    nombre: "Bioestimuladores",
    tieneSubopciones: true,
    subopciones: [
      { nombre: "Novuma (hidroxiapatita de calcio)", precio: "$440.000" },
      { nombre: "Radiesse (hidroxiapatita de calcio)", precio: "$490.000" },
      { nombre: "Sculpa (ácido poliláctico)", precio: "$560.000" },
      {
        nombre: "ADN de Salmón en ojeras (polinucleótidos)",
        precio: "$320.000",
      },
      {
        nombre: "ADN de Salmón en ojeras + Toxina Botulínica",
        precio: "$450.000",
      },
      { nombre: "Mesoterapia en rostro (3 sesiones)", precio: "$199.990" },
    ],
  },
  {
    icon: "⭐",
    nombre: "Láser CO²",
    tieneSubopciones: true,
    subopciones: [
      { nombre: "Láser CO² - Una sesión", precio: "$200.000" },
      { nombre: "Láser CO² - Pack de 3 sesiones", precio: "$450.000" },
      {
        nombre: "Láser CO² - Pack de 3 sesiones + vitaminas",
        precio: "$499.990",
      },
    ],
  },
  {
    icon: "💡",
    nombre: "IPL",
    tieneSubopciones: true,
    subopciones: [
      { nombre: "IPL - Pack de 5 sesiones", precio: "$300.000" },
      {
        nombre: "IPL - Rejuvenecimiento facial (IPL + Toxina Botulínica)",
        precio: "$199.990",
      },
    ],
  },
  {
    icon: "💊",
    nombre: "Vitaminas Endovenosas",
    tieneSubopciones: true,
    subopciones: [
      {
        nombre: "Skin Glow (Vit C + Oligoelementos + Glutatión)",
        precio: "$99.000",
      },
      { nombre: "Megadosis de Vitamina C", precio: "$80.000" },
    ],
  },
  {
    icon: "👃",
    nombre: "Rinomodelación",
    tieneSubopciones: false,
  },
  {
    icon: "💋",
    nombre: "Lips Glow",
    tieneSubopciones: false,
  },
  {
    icon: "🩺",
    nombre: "Consulta / Evaluación",
    tieneSubopciones: true,
    subopciones: [
      { nombre: "Control", precio: "Sin costo" },
      { nombre: "Evaluación médica", precio: "$20.000" },
    ],
  },
];

const horariosFijos = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

function getDias() {
  const dias = [];
  const hoy = new Date();
  for (let i = 1; i <= 30; i++) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    if (d.getDay() !== 0) dias.push(d);
    if (dias.length === 14) break;
  }
  return dias;
}

const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function FormularioCita({ abierto, onCerrar }) {
  const [paso, setPaso] = useState(1);
  const [direccion, setDireccion] = useState(null);
  const [form, setForm] = useState({
    tratamiento: "",
    dia: null,
    horario: "",
    nombre: "",
    telefono: "",
    correo: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [ultimoEnvio, setUltimoEnvio] = useState(null);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [horariosDisponibles, setHorariosDisponibles] = useState(horariosFijos);
  const [subopcionSeleccionada, setSubopcionSeleccionada] = useState(null);
  const [tratamientoPadre, setTratamientoPadre] = useState(null);

  const dias = getDias();

  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  // Verificar horarios disponibles cuando cambia el día
  useEffect(() => {
    if (form.dia) {
      verificarHorariosDelDia(form.dia);
    }
  }, [form.dia]);

  async function verificarHorariosDelDia(fecha) {
    const disponibles = [];
    for (const h of horariosFijos) {
      const disponible = await verificarHorarioDisponible(fecha, h);
      if (disponible) disponibles.push(h);
    }
    setHorariosDisponibles(disponibles);
  }

  const handleCerrar = useCallback(() => {
    setPaso(1);
    setForm({
      tratamiento: "",
      dia: null,
      horario: "",
      nombre: "",
      telefono: "",
      correo: "",
    });
    setEnviado(false);
    setError("");
    setDireccion(null);
    setHorariosDisponibles(horariosFijos);
    setSubopcionSeleccionada(null); // ← NUEVO
    setTratamientoPadre(null); // ← NUEVO
    onCerrar();
  }, [onCerrar]);

  const avanzarPaso = useCallback(
    (nuevoPaso) => {
      setDireccion(nuevoPaso > paso ? "next" : "prev");
      setPaso(nuevoPaso);
    },
    [paso]
  );

  const validarFormulario = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefonoRegex = /^[\d\s\+\-\(\)]{7,15}$/;
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,60}$/;

    if (!nombreRegex.test(form.nombre.trim())) {
      setError("Nombre inválido. Solo letras y espacios, mínimo 3 caracteres.");
      return false;
    }
    if (!telefonoRegex.test(form.telefono.trim())) {
      setError("Teléfono inválido. Solo números, espacios y +.");
      return false;
    }
    if (!emailRegex.test(form.correo.trim())) {
      setError("Correo electrónico inválido.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    // === RATE LIMITING (2 minutos) ===
    const ahora = Date.now();
    if (ultimoEnvio && ahora - ultimoEnvio < RATE_LIMIT_MS) {
      const segundosRestantes = Math.ceil(
        (RATE_LIMIT_MS - (ahora - ultimoEnvio)) / 1000
      );
      setError(
        `Por favor espera ${segundosRestantes} segundos antes de intentar nuevamente.`
      );
      return;
    }

    // === VALIDACIONES ===
    if (!validarFormulario()) return;

    setError("");
    setEnviando(true);

    try {
      // ============================================
      // PASO 1: GUARDAR EN FIRESTORE (bloqueo atómico)
      // ============================================
      const resultado = await agendarCitaFirestore({
        tratamiento: form.tratamiento,
        fecha: form.dia,
        horario: form.horario,
        nombre: form.nombre,
        telefono: form.telefono,
        correo: form.correo,
      });

      // ¿El horario ya estaba ocupado?
      if (!resultado.success) {
        setError(resultado.error);
        setEnviando(false);
        return;
      }

      // ============================================
      // PASO 2: ENVIAR EMAILS (notificación paralela)
      // ============================================
      const diaStr = form.dia
        ? `${DIAS_SEMANA[form.dia.getDay()]} ${form.dia.getDate()} de ${
            MESES[form.dia.getMonth()]
          }`
        : "";

      const params = {
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
        correo_cliente: form.correo.trim(),
        especialidad: form.tratamiento,
        dia: diaStr,
        horario: form.horario,
        cita_id: resultado.citaId, // ← Nuevo: ID de Firestore
      };

      await Promise.all([
        emailjs.send(SERVICE_ID, TEMPLATE_CLIENTE, params, PUBLIC_KEY),
        emailjs.send(SERVICE_ID, TEMPLATE_DOCTOR, params, PUBLIC_KEY),
      ]);

      // === ÉXITO ===
      setUltimoEnvio(Date.now());
      setEnviado(true);
      setPaso(5);
    } catch (err) {
      console.error("Error:", err);
      setError(
        "Hubo un problema al guardar tu cita. Llámanos al +56 9 6432 2438."
      );
    } finally {
      setEnviando(false);
    }
  };

  const titulos = [
    "",
    "Tratamiento",
    "Sub-opción", // ← Nuevo
    "Fecha",
    "Horario",
    "Tus datos",
    "Confirmación",
  ];

  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={handleCerrar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#4a3728] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 id="modal-title" className="text-white font-semibold text-base">
              {enviado
                ? "¡Consulta agendada!"
                : paso === 1.5
                ? `Paso 2 de 4 — ${titulos[2]}`
                : paso > 1.5
                ? `Paso ${Math.floor(paso)} de 4 — ${
                    titulos[Math.floor(paso) + 1]
                  }`
                : `Paso ${paso} de 4 — ${titulos[paso]}`}
            </h2>
            <p className="text-white/60 text-xs mt-0.5">
              Dra. Carmen Montero · Médico Estético
            </p>
          </div>
          <button
            onClick={handleCerrar}
            className="text-white/70 hover:text-white text-2xl leading-none p-1 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        {/* Barra de progreso */}
        {!enviado && (
          <div className="flex h-1.5 bg-gray-100">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`flex-1 transition-all duration-500 ${
                  (paso >= 1.5 && n === 1) ||
                  n < paso ||
                  (paso === 1.5 && n === 1)
                    ? "bg-[#c9a882]"
                    : n <= paso
                    ? "bg-[#c9a882]"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}

        <div className="px-6 py-6 min-h-[400px]">
          <div
            className={`transition-all duration-300 ${
              direccion === "next"
                ? "animate-slide-in-right"
                : direccion === "prev"
                ? "animate-slide-in-left"
                : ""
            }`}
          >
            {/* Confirmación final */}
            {enviado && (
              <div className="text-center py-4">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-lg font-semibold text-[#4a3728] mb-1">
                  ¡Todo listo, {form.nombre.split(" ")[0]}!
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Enviamos tu confirmación a{" "}
                  <span className="text-[#c9a882] font-medium">
                    {form.correo}
                  </span>
                </p>
                <div className="bg-[#f5ede0] rounded-xl p-4 text-left text-sm flex flex-col gap-3 mb-6 border border-[#e8d5c0]">
                  <div className="flex justify-between items-center">
                    <span className="text-[#7a6152]">Tratamiento</span>
                    <span className="font-medium text-[#4a3728]">
                      {form.tratamiento}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#7a6152]">Fecha</span>
                    <span className="font-medium text-[#4a3728]">
                      {form.dia &&
                        `${
                          DIAS_SEMANA[form.dia.getDay()]
                        } ${form.dia.getDate()} ${MESES[form.dia.getMonth()]}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#7a6152]">Horario</span>
                    <span className="font-medium text-[#4a3728]">
                      {form.horario} hrs
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCerrar}
                  className="bg-[#4a3728] text-white px-8 py-2.5 rounded-full text-sm font-medium hover:bg-[#3a2a1e] transition-all duration-300 focus:ring-2 focus:ring-[#c9a882] focus:ring-offset-2 focus:outline-none"
                >
                  Cerrar
                </button>
              </div>
            )}

            {/* Paso 1 — Tratamiento */}
            {!enviado && paso === 1 && (
              <div>
                <p className="text-sm text-[#7a6152] mb-4">
                  ¿Qué tratamiento te interesa?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {tratamientos.map((t) => (
                    <button
                      key={t.nombre}
                      onClick={() => {
                        if (t.tieneSubopciones) {
                          setTratamientoPadre(t);
                          setPaso(1.5); // Ir a sub-opciones
                        } else {
                          setForm({ ...form, tratamiento: t.nombre });
                          avanzarPaso(2);
                        }
                      }}
                      className={`flex items-center gap-2 border rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-[#c9a882] focus:ring-offset-2
            ${
              form.tratamiento === t.nombre ||
              tratamientoPadre?.nombre === t.nombre
                ? "border-[#c9a882] bg-[#f5ede0] text-[#4a3728] shadow-md"
                : "border-gray-200 text-gray-700 hover:border-[#c9a882]/50 hover:shadow-sm"
            }`}
                    >
                      <span className="text-lg" aria-hidden="true">
                        {t.icon}
                      </span>
                      <span className="leading-tight">{t.nombre}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Paso 1.5 — Sub-opciones */}
            {!enviado && paso === 1.5 && tratamientoPadre && (
              <div>
                <p className="text-sm text-[#7a6152] mb-2">
                  Selecciona una opción de{" "}
                  <span className="font-semibold text-[#4a3728]">
                    {tratamientoPadre.nombre}
                  </span>
                </p>

                <div className="flex flex-col gap-2">
                  {tratamientoPadre.subopciones.map((sub) => (
                    <button
                      key={sub.nombre}
                      onClick={() => {
                        setSubopcionSeleccionada(sub);
                        setForm({ ...form, tratamiento: sub.nombre });
                        avanzarPaso(2);
                      }}
                      className={`flex flex-col border rounded-xl px-4 py-3 text-sm transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-[#c9a882] focus:ring-offset-2
        ${
          subopcionSeleccionada?.nombre === sub.nombre
            ? "border-[#c9a882] bg-[#f5ede0] text-[#4a3728] shadow-md"
            : "border-gray-200 text-gray-700 hover:border-[#c9a882]/50 hover:shadow-sm"
        }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{sub.nombre}</span>
                        <span className="text-[#c9a882] font-semibold text-xs whitespace-nowrap ml-2">
                          {sub.precio}
                        </span>
                      </div>

                      {/* Nota visible ANTES de hacer clic */}
                      {sub.nombre === "Evaluación médica" && (
                        <p className="mt-1.5 text-xs text-[#7a6152] italic">
                          * Se descuentan del total del tratamiento si se llegara a realizar alguno.
                        </p>
                      )}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setTratamientoPadre(null);
                    setSubopcionSeleccionada(null);
                    avanzarPaso(1);
                  }}
                  className="mt-4 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Volver a tratamientos
                </button>
              </div>
            )}

            {/* Paso 2 — Fecha */}
            {!enviado && paso === 2 && (
              <div>
                <p className="text-sm text-[#7a6152] mb-4">
                  Selecciona un día disponible
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {dias.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setForm({ ...form, dia: d });
                        avanzarPaso(3);
                      }}
                      className={`flex flex-col items-center py-3 rounded-xl border text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#c9a882] focus:ring-offset-2
                        ${
                          form.dia &&
                          form.dia.toDateString() === d.toDateString()
                            ? "border-[#c9a882] bg-[#c9a882] text-white shadow-md scale-105"
                            : "border-gray-200 text-gray-700 hover:border-[#c9a882]/50 hover:shadow-sm"
                        }`}
                    >
                      <span className="text-xs opacity-70">
                        {DIAS_SEMANA[d.getDay()]}
                      </span>
                      <span className="font-semibold text-base">
                        {d.getDate()}
                      </span>
                      <span className="text-xs opacity-70">
                        {MESES[d.getMonth()].slice(0, 3)}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => avanzarPaso(1)}
                  className="mt-4 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Volver.
                </button>
              </div>
            )}

            {/* Paso 3 — Horario (con verificación de disponibilidad) */}
            {!enviado && paso === 3 && (
              <div>
                <p className="text-sm text-[#7a6152] mb-4">
                  ¿A qué hora te acomoda?
                </p>

                {horariosDisponibles.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">
                      No hay horarios disponibles para este día.
                    </p>
                    <button
                      onClick={() => avanzarPaso(2)}
                      className="mt-4 text-[#c9a882] text-sm font-medium hover:underline"
                    >
                      Seleccionar otro día
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {horariosFijos.map((h) => {
                      const disponible = horariosDisponibles.includes(h);
                      return (
                        <button
                          key={h}
                          onClick={() => {
                            if (disponible) {
                              setForm({ ...form, horario: h });
                              avanzarPaso(4);
                            }
                          }}
                          disabled={!disponible}
                          className={`py-3 rounded-xl border text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#c9a882] focus:ring-offset-2
        ${
          !disponible
            ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
            : form.horario === h
            ? "border-[#c9a882] bg-[#c9a882] text-white shadow-md scale-105"
            : "border-gray-200 text-gray-700 hover:border-[#c9a882]/50 hover:shadow-sm"
        }`}
                        >
                          {h} hrs
                          {!disponible && (
                            <span className="block text-xs mt-0.5">
                              Ocupado
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                <button
                  onClick={() => avanzarPaso(2)}
                  className="mt-4 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Volver
                </button>
              </div>
            )}

            {/* Paso 4 — Datos */}
            {!enviado && paso === 4 && (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-[#7a6152]">
                  Ingresa tus datos de contacto
                </p>
                <div>
                  <label
                    htmlFor="nombre"
                    className="text-xs font-medium text-[#7a6152] mb-1 block"
                  >
                    Nombre completo
                  </label>
                  <input
                    id="nombre"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                    placeholder="Juan Pérez"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#c9a882] focus:ring-2 focus:ring-[#c9a882]/20 transition-all duration-300"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="telefono"
                    className="text-xs font-medium text-[#7a6152] mb-1 block"
                  >
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    value={form.telefono}
                    onChange={(e) =>
                      setForm({ ...form, telefono: e.target.value })
                    }
                    placeholder="+56 9 6432 2438"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#c9a882] focus:ring-2 focus:ring-[#c9a882]/20 transition-all duration-300"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label
                    htmlFor="correo"
                    className="text-xs font-medium text-[#7a6152] mb-1 block"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="correo"
                    type="email"
                    value={form.correo}
                    onChange={(e) =>
                      setForm({ ...form, correo: e.target.value })
                    }
                    placeholder="correo@gmail.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#c9a882] focus:ring-2 focus:ring-[#c9a882]/20 transition-all duration-300"
                    autoComplete="email"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-red-600 text-xs">{error}</p>
                  </div>
                )}

                <div className="flex gap-3 mt-1">
                  <button
                    onClick={() => avanzarPaso(3)}
                    className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Volver
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={enviando}
                    className="flex-1 bg-[#4a3728] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#3a2a1e] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#c9a882] focus:ring-offset-2 flex items-center justify-center gap-2"
                  >
                    {enviando ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      "Confirmar consulta"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
