import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { AudioType } from '@/types/global';
import { useAudioStore } from '@/store/useAudioStore';
import { Alert, ToastAndroid } from 'react-native';

const AUDIO_STORAGE_KEY = 'AUDIO_FILES';

function useAudioStorageService() {
  const { addAudio, removeAudio, clearAudios, setAudios, audios } = useAudioStore();

  // Guarda la metadata del audio y mueve el archivo a una ubicación persistente
  const saveAudio = async (audio: AudioType) => {
    try {
      // Define una carpeta en el FileSystem de la app
      //* Por q crear un nuevo directorio:
      // ** Persistencia y Organización: Al mover los audios a una carpeta específica, te aseguras de que estén en un lugar controlado y organizado, separándolos de otros archivos temporales o datos del sistema.
      //** Acceso y Clasificación: Tener una ruta fija facilita acceder a estos archivos, listarlos o clasificarlos (por ejemplo, por reporte o fecha) sin depender de rutas temporales que puedan cambiar.
      //** Manejo de Almacenamiento: Al utilizar un directorio propio, puedes gestionar mejor el almacenamiento, como limpiar archivos antiguos o verificar el estado de los audios sin interferir con otros recursos del sistema.*/

      if (!audio.processed) { // o según tu lógica, si no está procesado, se asume nuevo
        const audioDir = `${FileSystem.documentDirectory}audios/`;
        const fileName = audio.uri.split('/').pop();
        const newUri = `${audioDir}${fileName}`;

        const dirInfo = await FileSystem.getInfoAsync(audioDir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(audioDir, { intermediates: true });
        }
        await FileSystem.moveAsync({
          from: audio.uri,
          to: newUri,
        });

        // Actualiza la URI en el objeto
        audio.uri = newUri;
      }

      // Obtiene la lista de audios
      const storedAudios = await AsyncStorage.getItem(AUDIO_STORAGE_KEY);
      let audios: AudioType[] = storedAudios ? JSON.parse(storedAudios) : [];

      // Busca si ya existe un audio con el mismo id
      const existingIndex = audios.findIndex((a) => a.id === audio.id);
      if (existingIndex > -1) {
        // Actualiza el registro existente
        audios[existingIndex] = audio;
      } else {
        // Si es nuevo, lo agrega
        audios.push(audio);
      }

      await AsyncStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(audios));
      addAudio(audio);

      return audio;
    } catch (error) {
      console.error('Error al guardar el audio:', error);
      throw error;
    }
  };

  //
  const saveAudios = async (audiosToSave: AudioType[]) => {
    try {
      const storedAudios = await AsyncStorage.getItem(AUDIO_STORAGE_KEY);
      let existingAudios: AudioType[] = storedAudios ? JSON.parse(storedAudios) : [];

      // Crea un mapa para actualizar o insertar los nuevos
      const audioMap = new Map<string, AudioType>();
      for (const audio of [...existingAudios, ...audiosToSave]) {
        audioMap.set(audio.id, audio);
      }

      const mergedAudios = Array.from(audioMap.values());

      await AsyncStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(mergedAudios));
      setAudios(mergedAudios); // actualiza estado global

      return mergedAudios;
    } catch (error) {
      console.error("Error guardando audios en lote:", error);
      throw error;
    }
  };


  // Obtiene todos los audios almacenados
  const getStoredAudios = async () => {
    try {
      const storedAudios = await AsyncStorage.getItem(AUDIO_STORAGE_KEY);
      setAudios(storedAudios ? JSON.parse(storedAudios) : []);
      return storedAudios ? JSON.parse(storedAudios) : [];
    } catch (error) {
      console.error('Error al obtener audios almacenados:', error);
      return [];
    }
  };

  const deleteAudio = async (audioId: string) => {
    try {
      // Obtiene la lista actual de audios
      const storedAudios = await AsyncStorage.getItem(AUDIO_STORAGE_KEY);
      const audios = storedAudios ? JSON.parse(storedAudios) : [];

      // Busca el audio a eliminar
      const audioToDelete = audios.find((audio: any) => audio.id === audioId);
      if (!audioToDelete) {
        console.warn('No se encontró el audio con ese ID.');
        return;
      }

      // Elimina el archivo físico
      await FileSystem.deleteAsync(audioToDelete.uri);

      // Filtra la lista para eliminar el audio y actualiza AsyncStorage
      const updatedAudios = audios.filter((audio: any) => audio.id !== audioId);
      await AsyncStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(updatedAudios));
      removeAudio(audioId);//update global state

      return updatedAudios;
    } catch (error) {
      console.error('Error eliminando el audio:', error);
      throw error;
    }
  };

  const deleteAll = async () => {
    if (audios.length === 0) {
      ToastAndroid.show('No hay audios para eliminar', ToastAndroid.LONG);
      return;
    }
    Alert.alert(
      'Eliminar todos los audios',
      '¿Estás seguro de que quieres eliminar todos los audios? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            clearAudios();
          }
        }
      ]
    );
    ToastAndroid.show('Todos los audios han sido eliminados', ToastAndroid.LONG);
  };

  return {
    saveAudio,
    saveAudios,
    getStoredAudios,
    deleteAudio,
    deleteAll
  }

}

export default useAudioStorageService;

