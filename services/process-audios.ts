// services/process-audios.ts
import { useAudioStore } from "@/store/useAudioStore";
import useAudioStorage from "@/services/useAudioStorageService";
import { processAudioWithGemini } from "./GeminiService";
import { AudioType } from "@/types/global";
import useLoading from "@/hooks/useLoading";
import { ToastAndroid } from "react-native";

function useProcessAudios() {
  const { audios } = useAudioStore();
  const { saveAudios } = useAudioStorage();
  const { startLoading, stopLoading, loading } = useLoading();

  const processAudios = async () => {
    if (audios.length === 0) {
      console.log("No hay audios para procesar");
      return;
    }

    console.log("PROCESSING AUDIOS...");
    startLoading();
    const updatedAudios: AudioType[] = [];

    for (let audio of audios) {
      if (audio.processed) {
        console.log(`Audio ${audio.id} ya fue procesado, saltando.`);
        continue;
      }

      try {
        const response = await processAudioWithGemini(audio.uri);

        let dataParsed;
        try {
          const cleaned = response.replace(/```json/g, '').replace(/```/g, '');
          dataParsed = JSON.parse(cleaned);
        } catch (error) {
          console.error("Error al parsear JSON:", error);
          dataParsed = response; // en caso de error, se guarda como texto plano
        }

        const updatedAudio: AudioType = {
          ...audio,
          data: dataParsed,
          processed: true,
          sent: true,
        };

        updatedAudios.push(updatedAudio);
        console.log(`Audio ${audio.id} procesado: `, response);
      } catch (error) {
        console.error(`Error procesando el audio ${audio.id}:`, error);
        stopLoading();
      }
    }

    stopLoading();
    if (updatedAudios.length > 0) {
      await saveAudios(updatedAudios);
      console.log("Todos los audios procesados han sido guardados.");
    }

    ToastAndroid.show("Todos los audios han sido procesados", ToastAndroid.LONG);
  };


  return {
    processAudios,
    loading,
  };
}

export default useProcessAudios;