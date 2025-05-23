import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import RecordBtn from '@/components/RecordBtn';
import { styles } from '@/styles/components';
import AudioList from '@/components/AudioList';
import ProcessAudios from '@/components/ProcessAudiosBtn';

export default function App() {

  return (
    <View style={styles.container}>
      <AudioList />
      <View style={styles.buttonsRow}>
        <ProcessAudios />
        <RecordBtn />
      </View>


    </View>
  );
}