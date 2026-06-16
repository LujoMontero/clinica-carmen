import { initializeApp } from 'firebase/app';
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

// 1. CONFIGURACIÓN - Lee las variables del .env// ============================================
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

// ✅ SOLO ESTA FUNCIÓN (elimina la otra duplicada)
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