import { Text } from 'react-native'
import React from 'react'
import { Button, Dialog, Portal } from 'react-native-paper'
import { AudioType, DialogDeleteProps } from '@/types/global';
import useAudioStorageService from '@/services/useAudioStorageService';


//TODO: visibleDialog needs to be a bool prop
function DialogDelete({
  show,
  audio,
  onDismiss
}: DialogDeleteProps) {
  const { deleteAudio } = useAudioStorageService();
  // Funciones para manejar el diálogo
  const confirmDelete = async () => {
    if (audio) {
      show = false;
      await deleteAudio(audio.id);
    }
  };


  return (
    <Portal>
      <Dialog visible={show} onDismiss={() => onDismiss}>
        <Dialog.Title>Confirmar eliminación</Dialog.Title>
        <Dialog.Content>
          <Text>¿Estás seguro que deseas eliminar este audio?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => onDismiss}>Cancelar</Button>
          <Button onPress={confirmDelete}>Eliminar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )

}

export default DialogDelete