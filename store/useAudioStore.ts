import { create } from "zustand";
import { AudioType } from "@/types/global";

interface AudioStore {
  audios: AudioType[];
  setAudios: (audios: AudioType[]) => void;
  addAudio: (audio: AudioType) => void;
  removeAudio: (id: string) => void;
  clearAudios: () => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  audios: [],

  setAudios: (audios) => set({ audios }),

  addAudio: (audio) =>
    set((state) => ({
      audios: [...state.audios, audio],
    })),

  removeAudio: (id) =>
    set((state) => ({
      audios: state.audios.filter((a) => a.id !== id),
    })),

  clearAudios: () => set({ audios: [] }),
}));
