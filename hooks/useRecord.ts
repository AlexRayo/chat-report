import { useRef } from "react";
import { Audio } from 'expo-av';

import useLoading from "./useLoading";
import { AudioType } from "@/types/global";
import useAudioStorageService from "@/services/useAudioStorageService";

const MAX_RECORDING_TIME = 15000; // (cámbialo a 60000 para 60 segundos)

function useRecord() {
  // Speech recognition
  const recordingRef = useRef<Audio.Recording | null>(null);
  const maxRecordingTimeout = useRef<NodeJS.Timeout | null>(null);

  const { startLoading, stopLoading } = useLoading();
  const { saveAudio } = useAudioStorageService();


  // Funciones para manejar el diálogo de reconocimiento y guardado de audio
  const startRecording = async () => {
    console.log("Start recording delayed");
    try {
      // Crear la grabación
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording; // Actualizar referencia

      // Programar el límite máximo de grabación (por ejemplo, 10 segundos para pruebas)
      maxRecordingTimeout.current = setTimeout(async () => {
        await stopRecording();
      }, MAX_RECORDING_TIME);
    } catch (error) {
      console.error('Error al iniciar grabación:', error);
    }
  };

  const stopRecording = async () => {
    console.log("stop recording:", recordingRef.current)
    if (maxRecordingTimeout.current) {
      clearTimeout(maxRecordingTimeout.current);
      maxRecordingTimeout.current = null;
    }
    if (!recordingRef.current) return;

    startLoading();
    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();

      if (!uri) throw new Error('No se pudo obtener el audio');

      const entry: AudioType = {
        id: Date.now().toString(),
        uri,
        data: { titulo: "" },
        date: new Date().toISOString(),
        processed: false,
        sent: false,
      };

      saveAudio(entry);
    } catch (error) {
      console.error('Error completo:', error);
    } finally {
      recordingRef.current = null;
      stopLoading();
    }
  };
  return {
    startRecording,
    stopRecording,
  };
}

export default useRecord;