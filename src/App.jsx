import { useState } from 'react'
import Hero from './components/Hero'
import Services from './components/Services'
import FormularioCita from './components/FormularioCita'
import WhatsAppButton from './components/WhatsAppButton'
import './styles/animations.css'

export default function App() {
  const [modalAbierto, setModalAbierto] = useState(false)

  const abrirModal = () => setModalAbierto(true)
  const cerrarModal = () => setModalAbierto(false)

  return (
    <div className="min-h-screen bg-white">
      <Hero onAgendar={abrirModal} />
      <Services onAgendar={abrirModal} />
      <FormularioCita abierto={modalAbierto} onCerrar={cerrarModal} />
      <WhatsAppButton />
    </div>
  )
}
