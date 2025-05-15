export interface AudioType {
  id: string;
  date: string;
  uri: string;
  processed: boolean;
  data: { titulo: string };//proccessed data
  sent: boolean;
}

export interface DialogDeleteProps {
  show: boolean;
  audio: AudioType | null;
  onDismiss: () => void;
}