const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// Inicializar Firebase Admin
admin.initializeApp();

// CONFIGURACIÓN - Reemplaza con tus valores
const SHEET_ID = '1fweng4ojo84e8BSSo-F6FeiJr1Dq8Q7WHtgHaIjfc28';
const SERVICE_ACCOUNT = require('./service-account.json');
// ============================================
// CLOUD FUNCTION: Se ejecuta cuando se crea una cita
// ============================================
exports.sincronizarCitaASheets = functions.firestore
  .document('citas/{citaId}')
  .onCreate(async (snap, context) => {
    const cita = snap.data();
    const citaId = context.params.citaId;
    
    console.log(`📝 Nueva cita detectada: ${citaId}`);
    
    // Evitar duplicados
    if (cita.sincronizadoSheets === true) {
      console.log(`⏭️ Cita ${citaId} ya sincronizada. Saltando.`);
      return;
    }
    
    try {
      // Autenticación con Google Sheets
      const serviceAccountAuth = new JWT({
        email: SERVICE_ACCOUNT.client_email,
        key: SERVICE_ACCOUNT.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      
      // Abrir la hoja de cálculo
      const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
      await doc.loadInfo();
      
      // Usar la primera hoja
      const sheet = doc.sheetsByIndex[0];
      
      // Formatear fecha para que se vea bonita
      const fechaObj = cita.fecha ? new Date(cita.fecha + 'T00:00:00') : null;
      const fechaFormateada = fechaObj 
        ? fechaObj.toLocaleDateString('es-CL', {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          })
        : 'N/A';
      
      // Escribir la fila
      await sheet.addRow({
        'ID Cita': citaId,
        'Fecha': fechaFormateada,
        'Hora': cita.horario || 'N/A',
        'Paciente': cita.nombre || 'N/A',
        'Email': cita.correo || 'N/A',
        'Teléfono': cita.telefono || 'N/A',
        'Tratamiento': cita.tratamiento || 'N/A',
        'Estado': cita.estado || 'confirmada',
        'Sincronizado': new Date().toLocaleString('es-CL')
      });
      
      // Marcar como sincronizado en Firestore
      await admin.firestore().doc(`citas/${citaId}`).update({
        sincronizadoSheets: true,
        sincronizadoEn: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`✅ Cita ${citaId} sincronizada a Google Sheets`);
      
    } catch (error) {
      console.error('❌ Error sincronizando a Sheets:', error);
      // No marcar como sincronizado para que se reintente
    }
  });