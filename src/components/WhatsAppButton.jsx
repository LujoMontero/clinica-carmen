import { useState } from 'react'
import { WhatsAppIcon } from './WhatsAppIcon'

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false)
  const msg = encodeURIComponent('Hola, me gustaría consultar con la Dra. Carmen Montero. Mas información, por favor.')
  const url = `https://wa.me/56964322438?text=${msg}`

  return (
    <>
      {/* Tooltip */}
      <div 
        className={`fixed bottom-24 right-6 z-50 hidden md:block transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <div className="bg-[#4a3728] text-white text-xs px-4 py-2.5 rounded-xl shadow-xl whitespace-nowrap relative">
          ¿Tienes dudas? Escríbenos
          <div className="absolute -bottom-1.5 right-5 w-3 h-3 bg-[#4a3728] rotate-45" />
        </div>
      </div>

      {/* Botón principal */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 focus:ring-4 focus:ring-[#25D366]/30 focus:outline-none z-50 motion-reduce:hover:scale-100 motion-reduce:transition-none active:scale-95"
        aria-label="Contactar por WhatsApp - Abre chat con Dra. Carmen Montero"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <WhatsAppIcon className="w-7 h-7 text-white" />
        
        {/* Indicador de pulse sutil */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 motion-reduce:animate-none" aria-hidden="true" />
      </a>
    </>
  )
}
