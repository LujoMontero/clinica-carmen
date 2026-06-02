const tratamientos = [
  { icon: '✨', nombre: 'Limpiezas Faciales', desc: 'Limpieza profunda y revitalización de la piel para una apariencia fresca y luminosa.' },
  { icon: '💉', nombre: 'Botox', desc: 'Tratamiento de toxina botulínica para reducir líneas de expresión y arrugas.' },
  { icon: '🌿', nombre: 'Bioestimuladores', desc: 'Estimulación natural del colágeno para rejuvenecer y mejorar la textura de la piel.' },
  { icon: '💧', nombre: 'Sueroterapia', desc: 'Vitaminas y nutrientes directamente al organismo para revitalizar desde adentro.' },
  { icon: '⭐', nombre: 'Mesoterapia con Vitaminas', desc: 'Microinyecciones de vitaminas y minerales para hidratar y nutrir la piel en profundidad.' },
  { icon: '👃', nombre: 'Rinomodelación', desc: 'Corrección estética de la nariz sin cirugía, con resultados naturales e inmediatos.' },
  { icon: '💋', nombre: 'Lips Glow', desc: 'Tratamiento para volumen y definición de labios con resultados naturales y duraderos.' },
]

export default function Services({ onAgendar }) {
  return (
    <>
      {/* Tratamientos */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-[#c9a882] text-center mb-2 font-medium">Servicios</p>
          <h2 className="text-3xl font-light text-center text-[#4a3728] mb-3">Nuestros tratamientos</h2>
          <p className="text-center text-[#7a6152] text-sm mb-12 max-w-md mx-auto">
            Cada tratamiento es diseñado para realzar tu belleza natural con técnicas seguras y resultados reales.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tratamientos.map((t) => (
              <div key={t.nombre} className="border border-[#e8d5c0] rounded-2xl p-6 hover:border-[#c9a882] hover:shadow-sm transition-all">
                <div className="text-2xl mb-3">{t.icon}</div>
                <h3 className="font-medium text-[#4a3728] mb-2">{t.nombre}</h3>
                <p className="text-sm text-[#7a6152] leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre la Dra */}
      <section className="py-20 px-6 bg-[#f5ede0]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="w-64 h-64 rounded-full overflow-hidden flex-shrink-0 border-4 border-[#c9a882]/40 shadow-lg">
            <img src="/fotos/foto2.jpeg" alt="Dra. Carmen Montero" className="w-full h-full object-cover object-top" />
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-[#c9a882] mb-2 font-medium">Sobre mí</p>
            <h2 className="text-3xl font-light text-[#4a3728] mb-4">Dra. Carmen Montero</h2>
            <p className="text-[#7a6152] leading-relaxed mb-4">
              Médico Estético comprometida con la salud y bienestar de cada paciente. Trabajo con técnicas modernas y productos de alta calidad para ofrecerte resultados naturales que realcen tu belleza.
            </p>
            <div className="flex flex-col gap-2 text-sm text-[#7a6152]">
              <div className="flex items-center gap-2"><span className="text-[#c9a882]">✓</span> Atención personalizada</div>
              <div className="flex items-center gap-2"><span className="text-[#c9a882]">✓</span> Profesionalismo y confianza</div>
              <div className="flex items-center gap-2"><span className="text-[#c9a882]">✓</span> Comprometida con tu bienestar</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#4a3728] text-white text-center">
        <p className="text-xs tracking-widest uppercase opacity-50 mb-3 font-medium">Reserva tu hora</p>
        <h2 className="text-3xl font-light mb-3">¿Lista para comenzar?</h2>
        <p className="opacity-70 mb-8 max-w-md mx-auto text-sm">
          Agenda tu consulta con la Dra. Carmen Montero y da el primer paso hacia tu bienestar.
        </p>
        <button
          onClick={onAgendar}
          className="bg-[#c9a882] text-[#4a3728] px-10 py-3 rounded-full font-semibold hover:bg-[#b8966e] transition-colors"
        >
          Agendar consulta
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-[#3a2a1e] text-white/50 text-center text-xs py-5">
        © 2026 Dra. Carmen Montero · Médico Estético · Viña del Mar
      </footer>
    </>
  )
}