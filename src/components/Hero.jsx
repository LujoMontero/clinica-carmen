export default function Hero({ onAgendar }) {
  return (
    
    <section className="bg-[#f5ede0] flex flex-col md:flex-row min-h-screen">

      {/* Foto — arriba en móvil, derecha en desktop */}
      <div className="w-full md:flex-1 h-[60vw] md:h-auto md:min-h-screen relative overflow-hidden order-1 md:order-2">
        <img
          src="/fotos/foto1.jpeg"
          alt="Dra. Carmen Montero"
          className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-[#f5ede0]/20 to-transparent" />
      </div>

      {/* Texto — abajo en móvil, izquierda en desktop */}
      <div className="w-full md:flex-1 flex flex-col justify-center px-8 md:px-10 py-10 md:py-0 order-2 md:order-1">
        <span className="text-xs tracking-widest uppercase text-[#c9a882] mb-4 block font-medium">
          Médico Estético · Viña del Mar
        </span>
        <h1 className="text-4xl md:text-6xl font-light text-[#4a3728] leading-tight mb-1">
          Dra. Carmen
        </h1>
        <h1 className="text-4xl md:text-6xl font-semibold text-[#4a3728] leading-tight mb-5">
          Montero
        </h1>
        <p className="text-[#7a6152] text-base md:text-lg mb-2 italic font-light">
          "Tu bienestar, nuestra prioridad"
        </p>
        <p className="text-[#7a6152] text-sm mb-8 max-w-sm leading-relaxed">
          Medicina estética con técnicas modernas y atención personalizada para realzar tu belleza natural.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onAgendar}
            className="bg-[#4a3728] text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-[#3a2a1e] transition-colors"
          >
            Agendar consulta
          </button>
          <a
            href="https://www.instagram.com/dracarmen_montero"
            target="_blank"
            rel="noreferrer"
            className="border border-[#c9a882] text-[#4a3728] px-8 py-3.5 rounded-full text-sm font-medium hover:bg-[#c9a882]/10 transition-colors text-center"
          >
            Ver Instagram ↗
          </a>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm text-[#7a6152]">
            <span className="w-2 h-2 rounded-full bg-[#c9a882] flex-shrink-0"></span>
            Av. Libertad 269, Piso 6, Of. 602 · Viña del Mar
          </div>
          <div className="flex items-center gap-3 text-sm text-[#7a6152]">
            <span className="w-2 h-2 rounded-full bg-[#c9a882] flex-shrink-0"></span>
            +56 9 6432 2438
          </div>
          <div className="flex items-center gap-3 text-sm text-[#7a6152]">
            <span className="w-2 h-2 rounded-full bg-[#c9a882] flex-shrink-0"></span>
            Dracarmenmontero01@gmail.com
          </div>
        </div>
      </div>

    </section>
  )
}