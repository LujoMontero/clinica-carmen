import Hero from './components/Hero'
import Services from './components/Services'
import WhatsAppButton from './components/WhatsAppButton'
import FormularioCita from './components/FormularioCita'
import { useState } from 'react'

function App() {
  const [modalAbierto, setModalAbierto] = useState(false)

  return (
    <div className="font-sans">
      <Hero onAgendar={() => setModalAbierto(true)} />
      <Services onAgendar={() => setModalAbierto(true)} />
      <WhatsAppButton />
      <FormularioCita abierto={modalAbierto} onCerrar={() => setModalAbierto(false)} />
    </div>
  )
}

export default App