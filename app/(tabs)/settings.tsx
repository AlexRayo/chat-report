import { StyleSheet } from 'react-native';
import { View } from 'react-native';

import DeleteAllAudiosBtn from '@/components/DeleteAllAudiosBtn';
import { styles } from '@/styles/components';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <DeleteAllAudiosBtn />
    </View>
  );
}
