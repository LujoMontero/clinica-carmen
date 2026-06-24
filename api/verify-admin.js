// api/verify-admin.js
export default function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  
  // La contraseña viene de variables de entorno del servidor (NO del frontend)
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD no está configurada en Vercel');
    return res.status(500).json({ error: 'Configuración incompleta' });
  }

  const isValid = password === adminPassword;
  
  res.status(200).json({ valid: isValid });
}