import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";
import { useRef, useState } from "react";
import { Audio } from 'expo-av';

import useLoading from "./useLoading";
import { AudioType } from "@/types/global";
import useAudioStorageService from "@/services/useAudioStorageService";

const MAX_RECORDING_TIME = 15000; // (cámbialo a 60000 para 60 segundos)

function useRecord() {
  // Speech recognition
  const recordingRef = useRef<Audio.Recording | null>(null);
  const maxRecordingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [transcript, setTranscript] = useState("");

  const { startLoading, stopLoading } = useLoading();
  const { saveAudio } = useAudioStorageService();

  useSpeechRecognitionEvent("result", (event) => {
    setTranscript(event.results[0]?.transcript);
    console.log("transcript:", event.results[0]?.transcript);
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("error code:", event.error, "error message:", event.message);
  });
  //

  const startRecognition = async () => {
    console.log("Start recording with speech recognition");
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    }
    // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: "es-ES",
      interimResults: true,
      continuous: true,
      androidIntentOptions: {
        EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 30000,
      },
    });
  }

  const stopRecognition = async () => {
    console.log("Stopping speech recognition");
    try {
      ExpoSpeechRecognitionModule.stop(); // Detiene y entrega resultado final
    } catch (e) {
      console.error("Error al detener reconocimiento:", e);
    }
  };

  // Funciones para manejar el diálogo de reconocimiento y guardado de audio
  const startRecording = async () => {
    console.log("Start recording delayed");
    try {
      startRecognition();
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
    stopRecognition();
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
    transcript
  };
}

export default useRecord;