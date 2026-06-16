import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'
import Hero from './components/Hero'
import Services from './components/Services'
import FormularioCita from './components/FormularioCita'
import WhatsAppButton from './components/WhatsAppButton'
import './styles/animations.css'

function Home() {
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}