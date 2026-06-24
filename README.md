# 🏥 Dra. Carmen Montero — Sitio Web Médico Estético

Sitio web profesional para la **Dra. Carmen Montero**, Médico Estético ubicada en Viña del Mar, Chile. Incluye landing page, sistema de agendamiento de citas en línea, envío automático de correos y botón de WhatsApp.

🌐 **Demo en vivo:** [clinica-carmen.vercel.app](https://clinica-carmen.vercel.app)

---

## ✨ Funcionalidades

- **Landing page** con identidad visual propia (colores nude/beige)
- **Formulario de agendamiento** en 4 pasos:
  1. Selección de tratamiento
  2. Selección de fecha (próximos 14 días)
  3. Selección de horario
  4. Datos de contacto
- **Correos automáticos** al cliente y a la doctora vía EmailJS
- **Botón "Agregar a Google Calendar"** en ambos correos
- **Botón de WhatsApp flotante** con tooltip
- **Animaciones de entrada** con soporte para `prefers-reduced-motion`
- **Responsive** para móvil, tablet y desktop
- **Link a Instagram** de la doctora

---

## 🛠️ Stack tecnológico

| Tecnología      | Uso                              |
| --------------- | -------------------------------- |
| React           | Librería principal de UI         |
| Vite            | Servidor de desarrollo y bundler |
| Tailwind CSS v4 | Estilos con clases utilitarias   |
| EmailJS         | Envío de correos sin backend     |
| Firebase        | Hosting y Cloud Functions        |
| Git + GitHub    | Control de versiones             |
| Vercel          | Hosting y despliegue automático  |

---

## 📁 Estructura del proyecto

```
clinica-app/
├── functions/               ← Firebase Cloud Functions
├── public/
│   └── fotos/
│       ├── foto1.jpeg       ← Hero principal
│       └── foto2.jpeg       ← Foto perfil doctora
├── src/
│   ├── components/
│   │   ├── Hero.jsx         ← Sección principal con foto
│   │   ├── Services.jsx     ← Tratamientos y CTA
│   │   ├── FormularioCita.jsx ← Modal de agendamiento
│   │   ├── WhatsAppButton.jsx ← Botón flotante WhatsApp
│   │   └── WhatsAppIcon.jsx ← Ícono SVG de WhatsApp
│   ├── styles/
│   │   └── animations.css   ← Animaciones personalizadas
│   ├── App.jsx              ← Componente raíz
│   ├── main.jsx             ← Punto de entrada
│   └── index.css            ← Estilos globales (Tailwind)
├── .firebaserc
├── firebase.json
├── package.json
└── vite.config.js
```

---

## 🚀 Cómo correr el proyecto localmente

### Requisitos previos

- Node.js v18 o superior
- npm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/LujoMontero/clinica-carmen.git

# Entrar a la carpeta
cd clinica-carmen

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre <http://localhost:5173> en el navegador.

---

## 🔑 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes claves de EmailJS:

```env
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_CLIENTE=tu_template_cliente
VITE_EMAILJS_TEMPLATE_DOCTORA=tu_template_doctora
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
```

> Las claves se obtienen desde el dashboard de [EmailJS](https://www.emailjs.com/).

---

### Templates de EmailJS

- **Template cliente** — Confirmación con datos de la cita y botón Google Calendar
- **Template doctora** — Notificación con datos del paciente y botón Google Calendar

---

## 📅 Tratamientos disponibles

- ✨ Limpiezas Faciales
- 💉 Botox
- 🌿 Bioestimuladores
- 💧 Sueroterapia
- ⭐ Mesoterapia con Vitaminas
- 👃 Rinomodelación
- 💋 Lips Glow

---

## 📞 Información de contacto

| Campo        | Dato                                                               |
| ------------ | ------------------------------------------------------------------ |
| Doctora      | Dra. Carmen Montero                                                |
| Especialidad | Médico Estético                                                    |
| Ubicación    | Av. Libertad 269, Piso 6, Of. 602 · Viña del Mar                   |
| WhatsApp     | +56 9 6432 2438                                                    |
| Correo       | Dracarmenmontero01@gmail.com                                       |
| Instagram    | [@dracarmen\_montero](https://www.instagram.com/dracarmen_montero) |

---

## 📦 Scripts disponibles

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Genera build de producción
npm run preview  # Previsualiza el build
```

---

## 🔄 Despliegue

El proyecto se despliega automáticamente en **Vercel** cada vez que se hace push a la rama `main`:

```bash
git add .
git commit -m "descripción del cambio"
git push
```

Vercel detecta los cambios y despliega en 1–2 minutos.

---

## 👨‍💻 Desarrollado por

**Luis Montero** — Backend Developer  
Valparaíso, Chile

---

*© 2026 Dra. Carmen Montero · Médico Estético · Viña del Mar*
