import React from 'react'
import { Button } from 'react-native-paper'

import useProcessAudios from '@/services/process-audios'

const ProcessAudios = () => {
  const { processAudios, loading } = useProcessAudios();
  return (
    <Button
      icon="send"
      loading={loading}
      disabled={loading}
      compact={true} onPress={processAudios}>
      PROCESAR AUDIOS
    </Button>
  )
}

export default ProcessAudios