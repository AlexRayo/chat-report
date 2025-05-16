import { Text } from 'react-native'
import React from 'react'
import { Button, Dialog, Portal } from 'react-native-paper'
import { DialogDeleteProps } from '@/types/global';
import useAudioStorageService from '@/services/useAudioStorageService';

function DialogDelete({
  show,
  audio,
  setShow,
}: DialogDeleteProps) {
  const { deleteAudio } = useAudioStorageService();

  const confirmDelete = async () => {
    if (audio) {
      await deleteAudio(audio.id);
      setShow(false);
    }
  };

  return (
    <Portal>
      <Dialog visible={show} onDismiss={() => setShow(false)}>
        <Dialog.Title>Confirmar eliminación</Dialog.Title>
        <Dialog.Content>
          <Text>¿Estás seguro que deseas eliminar este audio?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShow(false)}>Cancelar</Button>
          <Button onPress={confirmDelete}>Eliminar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default DialogDelete