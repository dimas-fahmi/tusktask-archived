import imageCompression, { type Options } from "browser-image-compression";
import type { CropperStatus } from "../stores/ui/cropperStore";

export async function compressImage(
  file: File,
  options: Options,
  setStatus: (status: CropperStatus) => void,
  startAt?: number,
): Promise<File> {
  return await imageCompression(file, {
    ...options,
    onProgress: (percent: number) => {
      setStatus({
        code: "on_process",
        progress: startAt ? startAt + percent : percent,
        message: "Compressing",
      });
    },
  });
}
