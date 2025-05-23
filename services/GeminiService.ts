// services/GeminiService.ts
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { ToastAndroid } from 'react-native';

export const processAudioWithGemini = async (audioUri: string): Promise<string> => {
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`;
  const TITLE = "title";
  const DESCRIPTION = "description";
  try {
    // 1. Leer y codificar el audio en base64
    const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 2. Preparar el cuerpo de la solicitud
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Transcribe este audio, analiza su contenido y responde en formato JSON; es para enviar a una base de datos de una ONG. Es importante que trates de determinar un ${TITLE} como key del JSON del audio(sobre lo que trate), clasifica los puntos importantes como un ${DESCRIPTION} key. Ignora el ruido de fondo o sonidos, solo analiza la voz:`
            },
            {
              inlineData: {
                mimeType: 'audio/m4a', // cambia a audio/mp3 si aplica
                data: base64Audio,
              }
            }
          ]
        }
      ]
    };

    const response = await axios.post(GEMINI_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response.data.candidates[0].content.parts[0].text;

  } catch (error: any) {
    console.error('Error en Gemini:', error?.response?.data || error.message);

    if (error?.response?.status === 400) {
      ToastAndroid.show("Solicitud malformada: verifica formato de audio o prompt", ToastAndroid.LONG);
    } else {
      ToastAndroid.show("Error procesando audio con Gemini", ToastAndroid.LONG);
    }

    throw new Error('Error procesando el audio');
  }
};