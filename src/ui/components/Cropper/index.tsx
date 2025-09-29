import Cropper from "react-easy-crop";
import { Button } from "../../shadcn/components/ui/button";

import React, { useState } from "react";
import {
  LoaderCircle,
  LucideIcon,
  RectangleHorizontal,
  RectangleVertical,
  Square,
} from "lucide-react";
import { useCropperStore } from "@/src/lib/stores/ui/cropperStore";
import {
  getCroppedImg,
  GetCroppedImgSettings,
} from "@/src/lib/utils/getCroppedImage";
import { Progress } from "../../shadcn/components/ui/progress";

export interface ImageCropperProps {
  aspect?: number;
  roundCropAreaPixels?: boolean;
  loading?: boolean;
  setLoading: (n: boolean) => void;
  compressionOptions?: GetCroppedImgSettings;
}

const AspectRatioButton = ({
  aspectRatio,
  setTo,
  setAspectRatio,
  icon,
  label,
  disabled,
}: {
  aspectRatio: number;
  setTo: number;
  setAspectRatio: React.Dispatch<React.SetStateAction<number>>;
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
}) => {
  const Icon = icon;

  return (
    <button
      className={`${
        aspectRatio === setTo ? "border glass-card" : "hover:border-border"
      } flex flex-col border-transparent text-xs font-light cursor-pointer transition-all duration-300 px-4 py-2 items-center justify-center rounded-xl disabled:opacity-50`}
      onClick={() => setAspectRatio(setTo)}
      disabled={disabled}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
};

const ImageCropper = ({
  aspect,
  roundCropAreaPixels = false,
  loading = false,
  setLoading,
  compressionOptions,
}: ImageCropperProps) => {
  // Pull States from stores
  const {
    crop,
    setCrop,
    croppingImage,
    setCroppedAreaPixels,
    zoom,
    setZoom,
    file,
    reset: handleReset,
    setPreview,
    setBlob,
    setCroppingImage,
    croppedAreaPixels,
    setFile,
    setStatus,
    status,
  } = useCropperStore();

  // Aspect Ratio
  const [aspectRatio, setAspectRatio] = useState(aspect ?? 1 / 1);

  // Handle Save
  const handleSave = async () => {
    if (croppingImage && croppedAreaPixels) {
      setLoading(true);
      const { url, blob, file } = await getCroppedImg(
        croppingImage,
        croppedAreaPixels,
        setStatus,
        compressionOptions
      );
      setLoading(false);
      setPreview(url);
      setFile(file);
      setBlob(blob);
      setCroppingImage(null);
      handleReset();
    }
  };

  return (
    croppingImage && (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/30 z-40">
        <div className="glass-card backdrop-blur-sm rounded-md">
          <header className="p-4 w-[320px] text-center">
            <h1 className="font-header text-2xl rounded-md">CROP IMAGE</h1>
            <p className="text-xs font-light block mx-auto max-w-48 truncate">
              {file?.name}
            </p>
          </header>

          {/* Cropper */}
          <div>
            <div className="relative w-[320px] h-[320px] overflow-hidden ">
              <Cropper
                image={croppingImage}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedAreaPixels) =>
                  setCroppedAreaPixels(croppedAreaPixels)
                }
                roundCropAreaPixels={roundCropAreaPixels}
              />
            </div>
          </div>

          {/* Aspect Ratio */}

          <div className="grid grid-cols-3 p-4 gap-4">
            <AspectRatioButton
              aspectRatio={aspectRatio}
              setTo={16 / 9}
              icon={RectangleHorizontal}
              label="16:9"
              setAspectRatio={setAspectRatio}
              disabled={aspect && aspect !== 16 / 9 ? true : false}
            />
            <AspectRatioButton
              aspectRatio={aspectRatio}
              setTo={9 / 16}
              icon={RectangleVertical}
              label="9:16"
              setAspectRatio={setAspectRatio}
              disabled={aspect && aspect !== 9 / 16 ? true : false}
            />
            <AspectRatioButton
              aspectRatio={aspectRatio}
              setTo={1 / 1}
              icon={Square}
              label="1:1"
              setAspectRatio={setAspectRatio}
              disabled={aspect && aspect !== 1 / 1 ? true : false}
            />
          </div>

          <div className="p-4 pt-0">
            <Progress value={status?.progress ?? 0} />
          </div>

          <div className="px-4 pb-4 rounded-md w-[320px] grid grid-cols-2 gap-4 z-50">
            <Button
              variant="outline"
              onClick={handleReset}
              size="sm"
              className="glass-card border-foreground shadow-2xl disabled:animate-pulse"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant={"outline"}
              className="glass-card capitalize border-foreground shadow-2xl disabled:animate-pulse"
              onClick={handleSave}
              size="sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  {status?.message}
                </>
              ) : (
                <>Save</>
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  );
};

export default ImageCropper;
