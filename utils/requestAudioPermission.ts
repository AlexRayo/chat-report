import * as Linking from 'expo-linking';
import { Audio } from 'expo-av';
import { Alert, Platform } from 'react-native';

export const requestAudioPermission = async () => {
  const { status, canAskAgain } = await Audio.requestPermissionsAsync();

  if (status !== 'granted') {
    if (!canAskAgain) {
      Alert.alert(
        'Permiso de Audio necesario',
        'Debes habilitar el micrófono manualmente en los ajustes de la app.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ir a ajustes', onPress: () => Linking.openSettings() },
        ]
      );
    } else {
      Alert.alert('Permiso de audio denegado');
    }
    return false;
  }

  return true;
};
