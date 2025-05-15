import React from 'react'
import { Button } from 'react-native-paper';

import useAudioStorageService from '@/services/useAudioStorageService';

const DeleteAllAudiosBtn = () => {
  const { deleteAll } = useAudioStorageService();

  return (
    <Button
      icon="delete"
      mode='outlined'
      onPress={deleteAll}
    >ELIMINAR AUDIOS</Button>
  )
}

export default DeleteAllAudiosBtn