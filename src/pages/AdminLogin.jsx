import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdminAnonimo } from "../firebase";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const navigate = useNavigate();

  // Verificar si hay bloqueo activo al cargar
  useEffect(() => {
    const bloqueoHasta = localStorage.getItem("adminBloqueoHasta");
    if (bloqueoHasta && Date.now() < parseInt(bloqueoHasta)) {
      setBloqueado(true);
      setTiempoRestante(Math.ceil((parseInt(bloqueoHasta) - Date.now()) / 1000));
    }
  }, []);

  // Cuenta regresiva del bloqueo
  useEffect(() => {
    if (!bloqueado || tiempoRestante <= 0) return;
    const intervalo = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          setBloqueado(false);
          setIntentos(0);
          localStorage.removeItem("adminBloqueoHasta");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, [bloqueado, tiempoRestante]);

  const formatearTiempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min}:${seg.toString().padStart(2, "0")}`;
  };

  const handleLogin = async () => {
    if (bloqueado) {
      setError(`Demasiados intentos. Espera ${formatearTiempo(tiempoRestante)}.`);
      return;
    }

    if (!password.trim()) {
      setError("Ingrese la contraseña");
      return;
    }

    setCargando(true);
    setError("");

    // Validar contraseña por API
    const response = await fetch("/api/verify-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (!data.valid) {
      const nuevosIntentos = intentos + 1;
      setIntentos(nuevosIntentos);

      if (nuevosIntentos >= 5) {
        const bloqueoHasta = Date.now() + 300000; // 5 minutos
        localStorage.setItem("adminBloqueoHasta", bloqueoHasta.toString());
        setBloqueado(true);
        setTiempoRestante(300);
        setError("Demasiados intentos. Bloqueado por 5 minutos.");
      } else {
        setError(`Contraseña incorrecta. Intento ${nuevosIntentos}/5`);
      }

      setCargando(false);
      return;
    }

    // Resetear intentos al acertar
    setIntentos(0);
    localStorage.removeItem("adminBloqueoHasta");

    // Autenticar anónimamente en Firebase
    const resultado = await loginAdminAnonimo();

    if (!resultado.success) {
      setError("Error de autenticación. Intente nuevamente.");
      setCargando(false);
      return;
    }

    // Guardar sesión
    sessionStorage.setItem("adminAuth", "true");
    sessionStorage.setItem("adminTime", Date.now().toString());

    setCargando(false);
    navigate("/admin");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-[#f5ede0] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-[#4a3728]">
            Dra. Carmen Montero
          </h1>
          <p className="text-sm text-[#7a6152] mt-1">Panel de administración</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#7a6152] block mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              disabled={bloqueado}
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all ${
                bloqueado
                  ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                  : "border-gray-200 focus:border-[#c9a882] focus:ring-2 focus:ring-[#c9a882]/20"
              }`}
              placeholder="••••••"
              autoFocus
            />
          </div>

          {error && (
            <p className={`text-sm text-center ${bloqueado ? "text-red-600 font-medium" : "text-red-500"}`}>
              {error}
            </p>
          )}

          {!bloqueado && intentos > 0 && (
            <p className="text-xs text-center text-amber-600">
              Intento {intentos}/5
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={cargando || bloqueado}
            className="w-full bg-[#4a3728] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#3a2a1e] transition-all disabled:opacity-50"
          >
            {cargando
              ? "Verificando..."
              : bloqueado
              ? `Bloqueado ${formatearTiempo(tiempoRestante)}`
              : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
