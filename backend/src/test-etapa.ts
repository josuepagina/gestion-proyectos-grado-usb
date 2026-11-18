import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

// El token del admin que deberías tener en tu sesión
const token = 'tu_token_aqui'; // Necesitas obtener esto del login

async function testCreateEtapa() {
  try {
    // ID de una materia existente
    const materiaId = 'd08b8ad8-c9db-429f-bbff-84a2f02ce19c';
    
    console.log('🧪 Testing etapa creation...');
    console.log('📝 Materia ID:', materiaId);

    const payload = {
      nombre: 'Test Etapa',
      descripcion: 'Esta es una etapa de prueba',
      tipo: 'documento',
      numero_orden: 1,
      fecha_apertura: '2026-01-20T19:15:00Z',
      fecha_cierre: '2026-01-22T19:15:00Z',
      fecha_limite_entrega: null,
      permitir_entregas_fuera_tiempo: false,
      descripcion_entrega: 'Prueba'
    };

    const response = await api.post(`/materias/${materiaId}/etapas`, payload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Etapa created:', response.data);
  } catch (error: any) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testCreateEtapa();
