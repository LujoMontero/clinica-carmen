import { useEffect, useRef, useState } from 'react'

const tratamientos = [
  { icon: '✨', nombre: 'Limpiezas Faciales', desc: 'Limpieza profunda y revitalización de la piel para una apariencia fresca y luminosa.' },
  { icon: '💉', nombre: 'Botox', desc: 'Tratamiento de toxina botulínica para reducir líneas de expresión y arrugas.' },
  { icon: '🌿', nombre: 'Bioestimuladores', desc: 'Estimulación natural del colágeno para rejuvenecer y mejorar la textura de la piel.' },
  { icon: '💧', nombre: 'Sueroterapia', desc: 'Vitaminas y nutrientes directamente al organismo para revitalizar desde adentro.' },
  { icon: '⭐', nombre: 'Mesoterapia con Vitaminas', desc: 'Microinyecciones de vitaminas y minerales para hidratar y nutrir la piel en profundidad.' },
  { icon: '👃', nombre: 'Rinomodelación', desc: 'Corrección estética de la nariz sin cirugía, con resultados naturales e inmediatos.' },
  { icon: '💋', nombre: 'Lips Glow', desc: 'Tratamiento para volumen y definición de labios con resultados naturales y duraderos.' },
]

const valores = [
  { icono: '💎', titulo: 'Excelencia', desc: 'Compromiso con los más altos estándares de calidad en cada procedimiento.' },
  { icono: '🤝', titulo: 'Confianza', desc: 'Relación basada en honestidad, transparencia y resultados verificables.' },
  { icono: '💡', titulo: 'Innovación', desc: 'Técnicas modernas y productos de última generación para mejores resultados.' },
]

// Hook personalizado para animación de entrada
function useIntersectionObserver() {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-[#c9a882] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function Services({ onAgendar }) {
  const { ref: sectionRef, isVisible } = useIntersectionObserver()
  const { ref: valoresRef, isVisible: valoresVisible } = useIntersectionObserver()

  return (
    <>
      {/* Tratamientos */}
      <section 
        ref={sectionRef}
        className="py-20 px-6 bg-white"
        aria-label="Nuestros tratamientos"
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-[#c9a882] text-center mb-2 font-medium">
            Servicios
          </p>
          <h2 className="text-3xl font-light text-center text-[#4a3728] mb-3">
            Nuestros tratamientos
          </h2>
          <p className="text-center text-[#7a6152] text-sm mb-12 max-w-md mx-auto leading-relaxed">
            Cada tratamiento es diseñado para realzar tu belleza natural con técnicas seguras y resultados reales.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tratamientos.map((t, index) => (
              <div 
                key={`tratamiento-${t.nombre}`}
                className={`border border-[#e8d5c0] rounded-2xl p-6 hover:border-[#c9a882] hover:shadow-lg transition-all duration-500 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#c9a882] focus:ring-offset-2 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                tabIndex={0}
                role="article"
                aria-label={`Tratamiento: ${t.nombre}`}
              >
                <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                  {t.icon}
                </div>
                <h3 className="font-medium text-[#4a3728] mb-2 group-hover:text-[#c9a882] transition-colors duration-300">
                  {t.nombre}
                </h3>
                <p className="text-sm text-[#7a6152] leading-relaxed">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre la Dra - Foto + Descripción */}
      <section className="py-20 px-6 bg-[#f5ede0]" aria-label="Sobre la Dra. Carmen Montero">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 mb-16">
          <div className="w-64 h-64 rounded-full overflow-hidden flex-shrink-0 border-4 border-[#c9a882]/40 shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <img 
              src="/fotos/foto2.jpeg" 
              alt="Dra. Carmen Montero, Médico Estético en consulta con paciente" 
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              loading="lazy"
              decoding="async"
              width="256"
              height="256"
            />
          </div>
          <div className="max-w-lg">
            <p className="text-xs tracking-widest uppercase text-[#c9a882] mb-2 font-medium">
              Sobre mí
            </p>
            <h2 className="text-3xl font-light text-[#4a3728] mb-4">
              Dra. Carmen Montero
            </h2>
            <p className="text-[#7a6152] leading-relaxed mb-4">
              Médico Estético comprometida con la salud y bienestar de cada paciente. Trabajo con técnicas modernas y productos de alta calidad para ofrecerte resultados naturales que realcen tu belleza.
            </p>
            <div className="flex flex-col gap-3 text-sm text-[#7a6152]">
              <div className="flex items-center gap-2">
                <CheckIcon />
                <span>Atención personalizada</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon />
                <span>Profesionalismo y confianza</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon />
                <span>Comprometida con tu bienestar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cita destacada */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 mb-20 bg-white rounded-2xl p-8 md:p-10 shadow-sm">
          <blockquote className="flex-1">
            <p className="text-[#4a3728] text-lg md:text-xl font-light leading-relaxed italic">
              "Mi compromiso es que salgas de la consulta sintiéndote escuchada, informada
              y con un plan que tenga sentido para ti — no para cualquiera."
            </p>
            <footer className="mt-4 text-sm text-[#c9a882] font-medium not-italic">
              — Dra. Carmen Montero, Médico Estético
            </footer>
          </blockquote>
        </div>

        {/* Tarjetas de valores */}
        <div className="max-w-5xl mx-auto" ref={valoresRef}>
          <p className="text-xs tracking-widest uppercase text-[#c9a882] text-center mb-8 font-medium">
            Mi enfoque
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {valores.map((v, i) => (
              <div
                key={v.titulo}
                className={`border border-[#e8d5c0] rounded-2xl p-6 hover:border-[#c9a882] hover:shadow-md transition-all duration-500 ${
                  valoresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="text-2xl mb-3" aria-hidden="true">{v.icono}</div>
                <h3 className="font-medium text-[#4a3728] mb-2 text-sm">{v.titulo}</h3>
                <p className="text-xs text-[#7a6152] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#4a3728] text-white text-center relative overflow-hidden" aria-label="Reserva tu hora">
        {/* Decoración sutil */}
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#c9a882] rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <p className="text-xs tracking-widest uppercase opacity-50 mb-3 font-medium">
            Reserva tu hora
          </p>
          <h2 className="text-3xl font-light mb-3">
            ¿Lista para comenzar?
          </h2>
          <p className="opacity-70 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            Agenda tu consulta con la Dra. Carmen Montero y da el primer paso hacia tu bienestar.
          </p>
          <button
            onClick={onAgendar}
            className="bg-[#c9a882] text-[#4a3728] px-10 py-3.5 rounded-full font-semibold hover:bg-[#b8966e] transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4a3728] focus:outline-none hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            Agendar consulta
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3a2a1e] text-white/50 text-center text-xs py-6">
        <p>© 2026 Dra. Carmen Montero · Médico Estético · Viña del Mar</p>
        <p className="mt-1 opacity-50">Av. Libertad 269, Piso 6, Of. 602</p>
      </footer>
    </>
  )
}