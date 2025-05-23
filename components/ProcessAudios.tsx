import React from 'react'
import { Button } from 'react-native-paper'

import useProcessAudios from '@/services/process-audios'

const ProcessAudios = () => {
  const { processAudios } = useProcessAudios();
  return (
    <Button icon="send" compact={true} onPress={processAudios}>
      ENVIAR AL SERVIDOR
    </Button>
  )
}

export default ProcessAudios