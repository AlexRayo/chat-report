import { Dimensions, FlatList, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { IconButton, Text } from 'react-native-paper';

import { AudioType, DialogDeleteProps } from '@/types/global';
import { useAudioStore } from '@/store/useAudioStore';
import useAudioController from '@/hooks/useAudioController';
import useAudioStorageService from '@/services/useAudioStorageService';
import { styles } from '@/styles/components';
import DialogDelete from './DialogDelete';

function AudioList() {
  const { audios } = useAudioStore();
  const [dialog, setDialog] = useState<DialogDeleteProps>({
    show: false,
    audio: null,
    onDismiss: () => { }
  });
  const { playAudio, toggleAudio, isPaused, audioUri } = useAudioController();
  const { getStoredAudios } = useAudioStorageService();

  useEffect(() => {
    getStoredAudios();
  }, []);

  return (
    <>
      <DialogDelete show={dialog.show}
        audio={dialog.audio}
        onDismiss={dialog?.onDismiss} />
      <Text variant='titleLarge' style={styles.h1}>
        {audios.length === 0 ? 'No hay audios' : 'Audios'}
      </Text>
      <FlatList
        data={audios}
        keyExtractor={(item: AudioType) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.audioItem, item.processed ? { backgroundColor: '#dcfce7' } : { backgroundColor: '#f1f1f1' }]}>
            <IconButton
              icon="delete"
              iconColor='tomato'
              onPress={() => setDialog((prev) => ({ ...prev, show: true, audio: item }))}
            />
            <View>
              <Text variant="bodyLarge" style={[{ fontWeight: 'bold', width: (Dimensions.get('window').width - 180) }]}>
                {item.processed ? item.data.titulo : 'Audio'}
              </Text>
              <Text variant="bodyLarge">
                {new Date(item.date).toLocaleString()}
              </Text>
            </View>


            <IconButton
              mode='outlined'
              icon={!isPaused && audioUri === item.uri ? "pause" : "play"}
              onPress={() => !isPaused && audioUri !== item.uri ? playAudio(item.uri) : toggleAudio()} />
          </View>
        )}
      />
    </>
  )

}

export default AudioList