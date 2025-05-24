import React, { useEffect } from 'react';
import { View } from 'react-native';
import RecordBtn from '@/components/RecordBtn';
import { styles } from '@/styles/components';
import AudioList from '@/components/AudioList';
import ProcessAudios from '@/components/ProcessAudiosBtn';
import { requestAudioPermission } from '@/utils/requestAudioPermission';

export default function App() {
  useEffect(() => {
    requestAudioPermission();
  }, []);

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