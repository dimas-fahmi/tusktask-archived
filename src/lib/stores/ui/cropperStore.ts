import { create } from "zustand";
import type { Area } from "react-easy-crop";
import { DEFAULT_AVATARS } from "../../configs";

export type Crop = { x: number; y: number };

export type CropperStatus = {
  code: string;
  message?: string;
  progress?: number;
};

export interface CropperStore {
  preview: string;
  setPreview: (n: string) => void;
  status: CropperStatus;
  setStatus: (n: CropperStatus) => void;
  crop: Crop;
  setCrop: (n: Crop) => void;
  zoom: number;
  setZoom: (n: number) => void;
  croppedAreaPixels: Area | null;
  setCroppedAreaPixels: (n: Area | null) => void;
  croppingImage: string | null;
  setCroppingImage: (n: string | null) => void;
  file: File | null;
  setFile: (n: File | null) => void;
  blob: Blob | null;
  setBlob: (n: Blob | null) => void;
  reset: () => void;
}

const cropperStoreDefaultValues = {
  status: {
    code: "idle",
    message: undefined,
    progress: undefined,
  },
  crop: { x: 0, y: 0 },
  zoom: 1,
  croppedAreaPixels: null,
  croppingImage: null,
};

export const useCropperStore = create<CropperStore>((set) => ({
  // Preview
  preview: DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)],
  file: null,
  blob: null,

  // Default Values
  ...cropperStoreDefaultValues,

  // Setter
  setStatus: (n) => set({ status: n }),
  setPreview: (n) => set({ preview: n }),
  setCrop: (n) => set({ crop: n }),
  setZoom: (n) => set({ zoom: n }),
  setCroppedAreaPixels: (n) => set({ croppedAreaPixels: n }),
  setCroppingImage: (n) => set({ croppingImage: n }),
  setFile: (n) => set({ file: n }),
  setBlob: (n) => set({ blob: n }),

  // Reset
  reset: () => set(cropperStoreDefaultValues),
}));
