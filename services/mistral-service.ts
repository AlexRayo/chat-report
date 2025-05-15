import axios from 'axios';

export const generarResumen = async (texto: string): Promise<string | null> => {
  try {
    const response = await axios.post('http://192.168.1.100:11434/api/generate', {
      model: 'mistral:7b-instruct-v0.3-q8_0',
      prompt: `Resume el siguiente texto en formato JSON con "titulo" y "descripcion" en español: ${texto}`,
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      //timeout: 150000
    });

    // Devuelve el texto generado
    return response.data.response;
  } catch (error) {
    console.error('❌ Error al generar resumen con Mistral:', error.message);
    return null;
  }
};
