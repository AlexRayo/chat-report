import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import Transcript from '@/components/Transcript';
import RecordBtn from '@/components/RecordBtn';
import { styles } from '@/styles/components';
import AudioList from '@/components/AudioList';

export default function App() {

  return (
    <View style={styles.container}>
      <AudioList />

      <Transcript />
      <View style={styles.buttonsRow}>
        <Button icon="send" compact={true} >
          ENVIAR AL SERVIDOR
        </Button>
        <RecordBtn />
      </View>


    </View>
  );
}