import { Button } from "react-native-paper";
import useRecord from "@/hooks/useRecord";

const RECORDING_DELAY = 500;
function RecordBtn() {
  const { startRecording, stopRecording } = useRecord();

  return (
    <Button
      mode="contained"
      compact={true}
      textColor='white'
      icon="microphone"
      accessibilityLabel="Botón para grabar el audio"
      accessibilityHint="Mantén presionado para grabar"
      onPressOut={stopRecording}
      delayLongPress={RECORDING_DELAY}
      onLongPress={startRecording}
    >
      GRABAR
    </Button>
  )
}

export default RecordBtn;
