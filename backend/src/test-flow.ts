// @ts-ignore - Test file, axios is optional
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

async function testFullFlow() {
  try {
    console.log('🧪 Starting test flow...\n');

    // Step 1: Login
    console.log('1️⃣ Logging in as admin...');
    const loginRes = await api.post('/auth/login', {
      email: 'admin@admin.com',
      password: 'admin'
    });
    
    const token = loginRes.data.token;
    console.log('✅ Login successful, token:', token.substring(0, 20) + '...\n');

    // Set token for future requests
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Step 2: Get a materia ID
    console.log('2️⃣ Getting gestiones...');
    const gestiones = await api.get('/gestiones');
    const gestion = gestiones.data.gestiones[0];
    const materia = gestion.materias ? gestion.materias[0] : null;
    
    console.log('✅ Found gestion:', gestion.nombre);
    console.log('✅ Found materia:', materia?.materia, '(ID:', materia?.id, ')\n');

    if (!materia?.id) {
      console.error('❌ No materia found');
      return;
    }

    // Step 3: Create an etapa
    console.log('3️⃣ Creating etapa...');
    const etapaRes = await api.post(`/materias/${materia.id}/etapas`, {
      nombre: 'Test Etapa ' + new Date().toISOString(),
      descripcion: 'Esta es una etapa de prueba',
      tipo: 'documento',
      fecha_apertura: '2026-01-20T19:15:00Z',
      fecha_cierre: '2026-01-22T19:15:00Z',
      permitir_entregas_fuera_tiempo: false,
      descripcion_entrega: 'Prueba de creación'
    });

    console.log('✅ Etapa created:', etapaRes.data.etapa.id);
    console.log('✅ Response:', etapaRes.data);

  } catch (error: any) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response?.data?.error) {
      console.error('   Error message:', error.response.data.error);
    }
  }
}

testFullFlow();
