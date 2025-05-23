export interface AudioType {
  id: string;
  date: string;
  uri: string;
  processed: boolean;
  data: { title: string, description: string };//proccessed data
  sent: boolean;
}

export interface DialogDeleteProps {
  show: boolean;
  audio: AudioType | null;
  setShow: (show: boolean) => void;
}