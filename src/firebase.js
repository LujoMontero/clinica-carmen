// ============================================
// CONFIGURACIÓN FIREBASE - Clínica Carmen
// ============================================

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  runTransaction, 
  serverTimestamp,
  getDoc
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

// 2. INICIALIZAR APP
const app = initializeApp(firebaseConfig);

// 3. OBTENER BASE DE DATOS
export const db = getFirestore(app);

// ============================================
// FUNCIÓN PRINCIPAL: Agendar cita
// ============================================
/**
 * Guarda una cita en Firestore y bloquea el horario atómicamente.
 * Usa "Transaction" para evitar que dos personas reserven el mismo horario.
 * 
 * @param {Object} datosCita - Datos de la cita
 * @returns {Object} { success: boolean, citaId: string, error: string }
 */
export async function agendarCitaFirestore(datosCita) {
  const { fecha, horario, nombre, telefono, correo, tratamiento } = datosCita;
  
  // Formato de fecha: YYYY-MM-DD (ej: 2026-06-15)
  const fechaStr = fecha.toISOString().split('T')[0];
  
  // ID único para el horario: "2026-06-15_10:00"
  const horarioId = `${fechaStr}_${horario}`;
  
  // Referencias a documentos en Firestore
  const citaRef = doc(collection(db, 'citas'));      // Nueva cita (ID auto)
  const horarioRef = doc(db, 'horarios', horarioId);  // Horario específico
  
  try {
    // TRANSACCIÓN ATÓMICA: Todo o nada
    await runTransaction(db, async (transaction) => {
      
      // Leer el horario actual
      const horarioDoc = await transaction.get(horarioRef);
      
      // ¿Ya está ocupado?
      if (horarioDoc.exists() && horarioDoc.data().disponible === false) {
        throw new Error('HORARIO_OCUPADO');
      }
      
      // === ESCRIBIR CITA ===
      transaction.set(citaRef, {
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        correo: correo.trim(),
        tratamiento,
        fecha: fechaStr,
        horario,
        estado: 'confirmada',
        creadoEn: serverTimestamp(),        // Fecha automática del servidor
        sincronizadoSheets: false           // Marca para Google Sheets
      });
      
      // === BLOQUEAR HORARIO ===
      transaction.set(horarioRef, {
        fecha: fechaStr,
        horario,
        disponible: false,                  // ← ¡Bloqueado!
        citaId: citaRef.id                  // Referencia a la cita
      });
    });
    
    // ÉXITO
    return { 
      success: true, 
      citaId: citaRef.id,
      mensaje: 'Cita agendada correctamente'
    };
    
  } catch (error) {
    // ERROR: Horario ya ocupado
    if (error.message === 'HORARIO_OCUPADO') {
      return { 
        success: false, 
        error: 'Este horario ya fue reservado. Por favor selecciona otro.',
        codigo: 'HORARIO_OCUPADO'
      };
    }
    
    // ERROR: Otro problema
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
/**
 * Verifica si un horario específico está disponible
 * 
 * @param {Date} fecha - Fecha seleccionada
 * @param {string} horario - Hora (ej: "10:00")
 * @returns {boolean} true = disponible, false = ocupado
 */
export async function verificarHorarioDisponible(fecha, horario) {
  const fechaStr = fecha.toISOString().split('T')[0];
  const horarioId = `${fechaStr}_${horario}`;
  
  const horarioRef = doc(db, 'horarios', horarioId);
  const horarioDoc = await getDoc(horarioRef);
  
  // Si no existe el documento, está disponible
  if (!horarioDoc.exists()) {
    return true;
  }
  
  // Si existe, verificar el campo "disponible"
  return horarioDoc.data().disponible !== false;
}