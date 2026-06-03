import { useEffect } from 'react'

export default function Hero({ onAgendar }) {
  useEffect(() => {
    // Preload de imagen crítica para LCP
    const img = new Image()
    img.src = '/fotos/foto1.jpeg'
  }, [])

  return (
    <section 
      className="bg-[#f5ede0] flex flex-col md:flex-row min-h-screen" 
      aria-label="Presentación principal - Dra. Carmen Montero"
    >
      {/* Imagen Hero — optimizada para LCP */}
      <div className="w-full md:flex-1 h-[60vw] md:h-auto md:min-h-screen relative overflow-hidden order-1 md:order-2">
        <img
          src="/fotos/foto1.jpeg"
          alt="Dra. Carmen Montero - Médico Estético en Viña del Mar"
          className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
          loading="eager"
          decoding="async"
          width="800"
          height="1000"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-[#f5ede0]/40 via-[#f5ede0]/10 to-transparent" 
          aria-hidden="true" 
        />
      </div>

      {/* Contenido */}
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
            className="bg-[#4a3728] text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-[#3a2a1e] transition-all duration-300 focus:ring-2 focus:ring-[#c9a882] focus:ring-offset-2 focus:outline-none hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            Agendar consulta
          </button>
          
          <a
            href="https://www.instagram.com/dracarmen_montero"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#c9a882] text-[#4a3728] px-8 py-3.5 rounded-full text-sm font-medium hover:bg-[#c9a882]/10 transition-all duration-300 text-center inline-flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#c9a882] focus:ring-offset-2 focus:outline-none hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            Ver Instagram
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Info de contacto — con links interactivos */}
        <address className="mt-10 flex flex-col gap-3 not-italic">
          <a 
            href="https://maps.google.com/?q=Av.+Libertad+269+Viña+del+Mar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-[#7a6152] hover:text-[#4a3728] transition-colors duration-300 group focus:outline-none focus:ring-2 focus:ring-[#c9a882] focus:ring-offset-2 rounded-lg p-1 -ml-1"
          >
            <span className="w-2 h-2 rounded-full bg-[#c9a882] flex-shrink-0 group-hover:scale-125 transition-transform duration-300" />
            <span className="group-hover:underline decoration-[#c9a882] underline-offset-4">Av. Libertad 269, Piso 6, Of. 602 · Viña del Mar</span>
          </a>
          <a 
            href="tel:+56964322438"
            className="flex items-center gap-3 text-sm text-[#7a6152] hover:text-[#4a3728] transition-colors duration-300 group focus:outline-none focus:ring-2 focus:ring-[#c9a882] focus:ring-offset-2 rounded-lg p-1 -ml-1"
          >
            <span className="w-2 h-2 rounded-full bg-[#c9a882] flex-shrink-0 group-hover:scale-125 transition-transform duration-300" />
            <span className="group-hover:underline decoration-[#c9a882] underline-offset-4">+56 9 6432 2438</span>
          </a>
          <a 
            href="mailto:Dracarmenmontero01@gmail.com"
            className="flex items-center gap-3 text-sm text-[#7a6152] hover:text-[#4a3728] transition-colors duration-300 group focus:outline-none focus:ring-2 focus:ring-[#c9a882] focus:ring-offset-2 rounded-lg p-1 -ml-1"
          >
            <span className="w-2 h-2 rounded-full bg-[#c9a882] flex-shrink-0 group-hover:scale-125 transition-transform duration-300" />
            <span className="group-hover:underline decoration-[#c9a882] underline-offset-4">Dracarmenmontero01@gmail.com</span>
          </a>
        </address>
      </div>
    </section>
  )
}