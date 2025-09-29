# Cropper Documentation

The `ImageCropper` component, paired with the `useCropperStore` Zustand store, provides a robust solution for cropping images in a React application. This guide explains how to use these components effectively, as demonstrated in the `AvatarPhase` component.

## Overview

The `ImageCropper` component allows users to crop images with customizable aspect ratios and compression settings. It integrates with the `useCropperStore` hook to manage state and supports features like zoom, crop area adjustments, and file handling. The `AvatarPhase` component showcases a practical implementation for avatar uploads with validation and default avatar selection.

## 1. Setting Up the Cropper Store

The `useCropperStore` hook manages the state for the cropping process. Import and use it to access setters and state values.

```ts
import { useCropperStore } from "@/src/lib/stores/ui/cropperStore";

const {
  setCroppingImage,
  setFile,
  preview,
  setPreview,
  file,
  crop,
  setCrop,
  zoom,
  setZoom,
  croppedAreaPixels,
  setCroppedAreaPixels,
  setBlob,
  setStatus,
  status,
  reset,
} = useCropperStore();
```

### Store Properties

- **preview**: URL of the preview image (default: random selection from `DEFAULT_AVATARS`).
- **file**: The selected `File` object for the image.
- **blob**: The cropped image as a `Blob`.
- **crop**: Coordinates `{ x: number, y: number }` for the crop area.
- **zoom**: Zoom level for the cropper (default: 1).
- **croppedAreaPixels**: The cropped area dimensions (`Area | null`).
- **croppingImage**: URL of the image being cropped.
- **status**: Object containing `code`, `message`, and `progress` for cropping status.
- **setters**: Functions to update the above properties (`setPreview`, `setFile`, etc.).
- **reset**: Resets the store to default values.

### Default Values

```ts
const cropperStoreDefaultValues = {
  status: { code: "idle", message: undefined, progress: undefined },
  crop: { x: 0, y: 0 },
  zoom: 1,
  croppedAreaPixels: null,
  croppingImage: null,
};
```

## 2. Using the ImageCropper Component

The `ImageCropper` component renders a modal for cropping images. It uses the `react-easy-crop` library for the cropping interface and supports aspect ratio selection.

### Import and Props

```ts
import ImageCropper from "@/src/ui/components/Cropper";

<ImageCropper
  aspect={1 / 1} // Optional: Set fixed aspect ratio (e.g., 1/1 for square)
  roundCropAreaPixels={false} // Optional: Round pixel values of cropped area
  loading={loading} // Boolean to indicate processing state
  setLoading={setLoading} // Function to toggle loading state
  compressionOptions={{ // Optional: Compression settings for cropped image
    compressionOptions: {
      maxSizeMB: 0.1, // Max file size in MB
      maxWidthOrHeight: 512, // Max dimension in pixels
    },
  }}
/>
```

### Key Features

- **Aspect Ratio Selection**: Users can choose from predefined aspect ratios (16:9, 9:16, 1:1) unless a fixed `aspect` prop is provided.
- **Zoom and Crop**: Users can adjust zoom and crop position, with changes reflected in the store.
- **Save and Cancel**: The "Save" button processes the cropped image using `getCroppedImg`, while "Cancel" resets the store.
- **Progress Indicator**: Displays progress during image compression.

### Example Usage

In the `AvatarPhase` component, `ImageCropper` is used to crop user-uploaded avatars:

```ts
const [loading, setLoading] = useState(false);

<ImageCropper
  aspect={1 / 1}
  loading={loading}
  setLoading={setLoading}
  compressionOptions={{
    compressionOptions: {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 512,
    },
  }}
/>
```

## 3. Handling File Input and Validation

The `AvatarPhase` component demonstrates how to handle file uploads and validate them before passing to the cropper.

### File Input Setup

Use a hidden `<input type="file">` to trigger file selection:

```ts
const hiddenInputRef = useRef<HTMLInputElement>(null);

<input
  type="file"
  accept={ALLOWED_IMAGE_MIME_TYPES.join(",")} // e.g., "image/jpeg,image/png,image/webp"
  className="hidden"
  onChange={(e) => handleInputChange(e)}
  ref={hiddenInputRef}
/>

<Button
  variant="outline"
  onClick={() => hiddenInputRef.current?.click()}
>
  <Camera />
</Button>
```

### Validation

Validate file type and size before cropping:

```ts
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
      setError({
        error: true,
        title: "Invalid File Type",
        description: "Only images allowed: JPG, PNG, WEBP",
      });
      e.target.value = "";
      return;
    }
    if (file.size > ALLOWED_IMAGE_MAX_MIME_SIZE) {
      setError({
        error: true,
        title: "Over Size Limit",
        description: "File is over size limit, can't be more than 5MB",
      });
      e.target.value = "";
      return;
    }
    setError(defaultAvatarPhaseErrorSate);
    const url = URL.createObjectURL(file);
    setFile(file);
    setCroppingImage(url);
  }
  e.target.value = "";
};
```

### Constants

```ts
const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_IMAGE_MAX_MIME_SIZE = 5 * 1024 * 1024; // 5MB
```

## 4. Managing Object URLs

To prevent memory leaks, revoke `ObjectURL`s when the preview changes:

```ts
const previousPreviewRef = useRef<string | null>(null);

useEffect(() => {
  const previousPreview = previousPreviewRef.current;
  if (previousPreview && detectURLType(previousPreview) === "ObjectURL") {
    URL.revokeObjectURL(previousPreview);
  }
  previousPreviewRef.current = preview;
}, [preview]);
```

## 5. Saving the Cropped Image

The `ImageCropper` component uses the `getCroppedImg` utility to process the cropped image. On save, it updates the store with the cropped image's URL, file, and blob.

```ts
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
    reset();
  }
};
```

### Uploading the Cropped Image

In `AvatarPhase`, the cropped image is uploaded using a mutation hook:

```ts
const { mutate: mutateUserAvatar } = useMutateUserAvatar();

<Button
  variant={file ? "default" : "outline"}
  onClick={() => {
    if (file) {
      mutateUserAvatar(file, {
        onSuccess: () => {
          mutateUserMetadata({ registration_phase: "confirmation" });
        },
      });
    }
  }}
  disabled={isMutatingUserAvatar || !file}
>
  Upload
</Button>
```

## 6. Default Avatars

The `AvatarPhase` component allows users to select from default avatars if they skip uploading:

```ts
<div className="grid grid-cols-4 pb-4 mt-2 gap-4 scrollbar-none">
  {DEFAULT_AVATARS.map((item) => (
    <Image
      width={120}
      height={120}
      src={item}
      alt="Default avatars"
      key={item}
      className="rounded-full min-w-18 max-w-18 min-h-18 max-h-18 md:min-w-24 md:min-h-24 md:max-w-24 md:max-h-24 drag-none select-none cursor-pointer active:scale-95 transition-all duration-300 shadow-xl"
      loading="eager"
      onClick={() => {
        setPreviewURL(item);
        setPreview(item);
        setFile(null);
      }}
    />
  ))}
</div>
```

## 7. Error Handling

Display errors using a `StaticAlert` component when validation fails:

```ts
{error?.error && (
  <StaticAlert
    title={error.title ?? ""}
    body={error?.description ?? ""}
    classes={{ container: "mt-4" }}
    variant={"destructive"}
    onClose={() => setError(defaultAvatarPhaseErrorSate)}
    closeIcon={XIcon}
  />
)}
```

## 8. Dependencies

- **react-easy-crop**: For the cropping interface.
- **zustand**: For state management.
- **lucide-react**: For icons (e.g., `Camera`, `RectangleHorizontal`).
- **next/image**: For optimized image rendering.
- **shadcn/ui**: For UI components like `Button` and `Progress`.

## 9. Example Workflow

1. User clicks the upload button, triggering the hidden file input.
2. The selected file is validated for type and size.
3. If valid, the file is converted to an `ObjectURL` and passed to `ImageCropper`.
4. The user adjusts the crop area, zoom, and aspect ratio.
5. On save, the cropped image is processed and stored in the `useCropperStore`.
6. The cropped image is uploaded via `mutateUserAvatar`, or a default avatar is selected.
7. Object URLs are revoked to prevent memory leaks.

This setup ensures a seamless image cropping and uploading experience with robust state management and error handling.
