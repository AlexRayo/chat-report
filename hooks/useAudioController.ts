import { AudioType } from "@/types/global";
import { Audio } from "expo-av";
import { useRef, useState } from "react";

function useAudioController() {

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [audioToDelete, setAudioToDelete] = useState<AudioType | null>(null)

  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Agrega una referencia para el sonido actualmente reproducido
  const currentSoundRef = useRef<Audio.Sound | null>(null);

  const playAudio = async (uri: string) => {
    setAudioUri(uri);
    try {
      // Si hay un sonido reproduciéndose, detenerlo y liberarlo
      if (currentSoundRef.current) {
        await currentSoundRef.current.stopAsync();
        await currentSoundRef.current.unloadAsync();
        currentSoundRef.current = null;
      }

      // Crear el nuevo sonido y guardarlo en la referencia global
      const { sound } = await Audio.Sound.createAsync({ uri });
      currentSoundRef.current = sound;

      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        // Al terminar de reproducir, liberar el recurso y limpiar la referencia
        if ('didJustFinish' in status && status.didJustFinish) {
          sound.unloadAsync();
          currentSoundRef.current = null;
          setAudioUri(null);
          setIsPaused(false);
        }
      });
    } catch (error) {
      console.error('Error reproduciendo el audio:', error);
    }
  };

  const toggleAudio = async () => {
    try {
      if (currentSoundRef.current) {
        if (isPaused) {
          await currentSoundRef.current.playAsync();
        } else {
          await currentSoundRef.current.pauseAsync();
        }
        setIsPaused(!isPaused);
      }
    } catch (error) {
      console.error("Error alternando el audio:", error);
    }
  };

  return {
    playAudio,
    toggleAudio,
    audioUri,
    setAudioUri,
    isPaused,
    setIsPaused,
    visibleDialog,
    setVisibleDialog,
    audioToDelete,
    setAudioToDelete,
  };
}

export default useAudioController;