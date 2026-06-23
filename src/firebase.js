// ============================================
// CONFIGURACIÓN FIREBASE - Clínica Carmen
// ============================================

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signOut } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  runTransaction, 
  serverTimestamp,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc
} from 'firebase/firestore';

// 1. CONFIGURACIÓN - Lee las variables del .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// 2. INICIALIZAR APP (antes de usar auth o db)
const app = initializeApp(firebaseConfig);

// 3. OBTENER SERVICIOS
export const db = getFirestore(app);
export const auth = getAuth(app);

// ============================================
// FUNCIÓN PRINCIPAL: Agendar cita
// ============================================
export async function agendarCitaFirestore(datosCita) {
  const { fecha, horario, nombre, telefono, correo, tratamiento } = datosCita;
  
  const fechaStr = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
  const horarioId = `${fechaStr}_${horario}`;
  
  const citaRef = doc(collection(db, 'citas'));
  const horarioRef = doc(db, 'horarios', horarioId);
  
  try {
    await runTransaction(db, async (transaction) => {
      const horarioDoc = await transaction.get(horarioRef);
      
      if (horarioDoc.exists() && horarioDoc.data().disponible === false) {
        throw new Error('HORARIO_OCUPADO');
      }
      
      transaction.set(citaRef, {
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        correo: correo.trim(),
        tratamiento,
        fecha: fechaStr,
        horario,
        estado: 'confirmada',
        creadoEn: serverTimestamp(),
        sincronizadoSheets: false
      });
      
      transaction.set(horarioRef, {
        fecha: fechaStr,
        horario,
        disponible: false,
        citaId: citaRef.id
      });
    });
    
    return { 
      success: true, 
      citaId: citaRef.id,
      mensaje: 'Cita agendada correctamente'
    };
    
  } catch (error) {
    if (error.message === 'HORARIO_OCUPADO') {
      return { 
        success: false, 
        error: 'Este horario ya fue reservado. Por favor selecciona otro.',
        codigo: 'HORARIO_OCUPADO'
      };
    }
    return { 
      success: false, 
      error: 'Error al guardar la cita. Inténtalo de nuevo.',
      codigo: 'ERROR_GENERAL'
    };
  }
}

// ============================================
// FUNCIÓN AUXILIAR: Verificar disponibilidad
// ============================================
export async function verificarHorarioDisponible(fecha, horario) {
  const fechaStr = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
  const horarioId = `${fechaStr}_${horario}`;
  
  const horarioRef = doc(db, 'horarios', horarioId);
  const horarioDoc = await getDoc(horarioRef);
  
  if (!horarioDoc.exists()) return true;
  
  return horarioDoc.data().disponible !== false;
}

// ============================================
// FUNCIONES PARA PANEL DE ADMINISTRACIÓN
// ============================================

/**
 * Obtener todas las citas en tiempo real
 * @param {Function} callback - Función que recibe el array de citas
 * @returns {Function} unsubscribe - Función para detener la escucha
 */
export function obtenerCitas(callback) {
  const q = query(collection(db, 'citas'), orderBy('creadoEn', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const citas = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
      creadoEn: document.data().creadoEn?.toDate?.() || null
    }));
    callback(citas);
  }, (error) => {
    console.error('Error obteniendo citas:', error);
    callback([]);
  });
}

/**
 * Actualizar el estado de una cita
 * Si se cancela, libera el horario automáticamente
 * @param {string} citaId - ID de la cita
 * @param {string} nuevoEstado - Estado nuevo
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @param {string} horario - Hora en formato HH:MM
 */
export async function actualizarEstadoCita(citaId, nuevoEstado, fecha, horario) {
  const citaRef = doc(db, 'citas', citaId);
  
  await updateDoc(citaRef, {
    estado: nuevoEstado,
    actualizadoEn: serverTimestamp()
  });

  // Si se cancela, liberar el horario
  if (nuevoEstado === 'cancelada') {
    const horarioId = `${fecha}_${horario}`;
    const horarioRef = doc(db, 'horarios', horarioId);
    
    await updateDoc(horarioRef, {
      disponible: true,
      citaId: null
    });
    
    console.log(`Horario ${horarioId} liberado`);
  }
}

// ============================================
// AUTENTICACIÓN PARA PANEL ADMIN
// ============================================

/**
 * Login anónimo para acceder a Firestore protegido
 */
export async function loginAdminAnonimo() {
  try {
    const result = await signInAnonymously(auth);
    return { success: true, uid: result.user.uid };
  } catch (error) {
    console.error('Error login anónimo:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verificar si hay sesión activa
 */
export function verificarSesionAdmin(callback) {
  return auth.onAuthStateChanged((user) => {
    callback(!!user);
  });
}

/**
 * Cerrar sesión
 */
export async function cerrarSesionAdmin() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}