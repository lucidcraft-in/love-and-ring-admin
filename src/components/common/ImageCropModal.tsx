import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCw, ZoomIn, ZoomOut, X, Check } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import Axios from "@/axios/axios";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  onCropComplete: (file: File, previewUrl: string) => void;
  aspect?: number;
  circularCrop?: boolean;
}

const rotateImageDataUrl = (src: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalHeight;
      canvas.height = img.naturalWidth;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingQuality = "high";
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((90 * Math.PI) / 180);
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
        resolve(canvas.toDataURL("image/jpeg", 0.95));
      } else {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
};

export function ImageCropModal({
  open,
  onOpenChange,
  imageSrc,
  onCropComplete,
  aspect,
  circularCrop = false,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [zoom, setZoom] = useState([1]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (open) {
      setZoom([1]);
      setCrop(undefined);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !imageSrc) {
      setDataUrl(null);
      return;
    }
    if (imageSrc.startsWith("data:") || imageSrc.startsWith("blob:")) {
      setDataUrl(imageSrc);
      return;
    }

    let isCancelled = false;
    const fullUrl = imageSrc.startsWith("http")
      ? imageSrc
      : `${Axios.defaults.baseURL || "http://localhost:3000"}${imageSrc.startsWith("/") ? "" : "/"}${imageSrc}`;

    fetch(fullUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (!isCancelled && reader.result) {
            setDataUrl(reader.result as string);
          }
        };
        reader.readAsDataURL(blob);
      })
      .catch((err) => {
        console.warn("Failed to fetch image blob for cropping, fallback to Image canvas", err);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const data = canvas.toDataURL("image/jpeg");
              if (!isCancelled) setDataUrl(data);
              return;
            }
          } catch (e) {
            console.warn("Canvas export failed", e);
          }
          if (!isCancelled) setDataUrl(fullUrl);
        };
        img.onerror = () => {
          if (!isCancelled) setDataUrl(fullUrl);
        };
        img.src = fullUrl;
      });

    return () => {
      isCancelled = true;
    };
  }, [open, imageSrc]);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      let newCrop: Crop;

      if (aspect) {
        newCrop = centerCrop(
          makeAspectCrop(
            {
              unit: "%",
              width: 90,
            },
            aspect,
            width,
            height
          ),
          width,
          height
        );
      } else {
        newCrop = {
          unit: "%",
          x: 5,
          y: 5,
          width: 90,
          height: 90,
        };
      }

      setCrop(newCrop);
    },
    [aspect]
  );

  const activeSrc = dataUrl || imageSrc;

  const handleRotate = async () => {
    if (!activeSrc) return;
    setIsProcessing(true);
    try {
      const rotated = await rotateImageDataUrl(activeSrc);
      setDataUrl(rotated);
      setCrop(undefined);
    } catch (e) {
      console.error("Rotation error", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const fallbackOriginalFile = async () => {
    try {
      const srcToUse = activeSrc;
      if (!srcToUse) {
        setIsProcessing(false);
        onOpenChange(false);
        return;
      }
      const res = await fetch(srcToUse);
      const blob = await res.blob();
      const file = new File([blob], `cropped-${Date.now()}.jpg`, {
        type: blob.type || "image/jpeg",
      });
      const previewUrl = URL.createObjectURL(file);
      onCropComplete(file, previewUrl);
    } catch (err) {
      console.error("Fallback crop file creation error:", err);
    } finally {
      setIsProcessing(false);
      onOpenChange(false);
    }
  };

  const getCroppedImg = async () => {
    const image = imgRef.current;
    if (!image) return;

    setIsProcessing(true);
    try {
      const naturalWidth = image.naturalWidth || image.width;
      const naturalHeight = image.naturalHeight || image.height;

      if (!naturalWidth || !naturalHeight) {
        await fallbackOriginalFile();
        return;
      }

      const activeCrop = crop && crop.width && crop.height
        ? crop
        : { unit: "%" as const, x: 0, y: 0, width: 100, height: 100 };

      const displayedWidth = image.clientWidth || image.width || naturalWidth;
      const displayedHeight = image.clientHeight || image.height || naturalHeight;

      let cropPercentX = 0;
      let cropPercentY = 0;
      let cropPercentW = 1;
      let cropPercentH = 1;

      if (activeCrop.unit === "%" || !activeCrop.unit) {
        cropPercentX = activeCrop.x / 100;
        cropPercentY = activeCrop.y / 100;
        cropPercentW = activeCrop.width / 100;
        cropPercentH = activeCrop.height / 100;
      } else {
        cropPercentX = activeCrop.x / displayedWidth;
        cropPercentY = activeCrop.y / displayedHeight;
        cropPercentW = activeCrop.width / displayedWidth;
        cropPercentH = activeCrop.height / displayedHeight;
      }

      const cropX = Math.max(0, Math.round(cropPercentX * naturalWidth));
      const cropY = Math.max(0, Math.round(cropPercentY * naturalHeight));
      const cropW = Math.min(naturalWidth - cropX, Math.round(cropPercentW * naturalWidth));
      const cropH = Math.min(naturalHeight - cropY, Math.round(cropPercentH * naturalHeight));

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, cropW);
      canvas.height = Math.max(1, cropH);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        await fallbackOriginalFile();
        return;
      }

      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropW,
        cropH,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.warn("outputCanvas.toBlob returned null, using fallback");
            fallbackOriginalFile();
            return;
          }
          const file = new File([blob], `cropped-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          const previewUrl = URL.createObjectURL(file);
          onCropComplete(file, previewUrl);
          setIsProcessing(false);
          onOpenChange(false);
        },
        "image/jpeg",
        0.95
      );
    } catch (err) {
      console.error("Error cropping image:", err);
      await fallbackOriginalFile();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crop & Adjust Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {activeSrc && (
            <div className="relative max-h-[420px] max-w-full overflow-auto flex justify-center items-center bg-muted/30 rounded-lg p-2">
              <div
                style={{
                  width: `${zoom[0] * 100}%`,
                  transition: "width 0.15s ease-out",
                }}
                className="flex justify-center"
              >
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  aspect={aspect}
                  circularCrop={circularCrop}
                  className="max-w-full"
                >
                  <img
                    ref={imgRef}
                    src={activeSrc}
                    alt="Crop preview"
                    onLoad={onImageLoad}
                    style={{
                      maxHeight: "380px",
                      width: "auto",
                      display: "block",
                    }}
                  />
                </ReactCrop>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="space-y-4 pt-2">
            {/* <div className="flex items-center gap-4 px-2">
              <ZoomOut className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={zoom}
                onValueChange={setZoom}
                min={1}
                max={2.5}
                step={0.1}
                className="flex-1"
              />
              <ZoomIn className="w-4 h-4 text-muted-foreground" />
            </div> */}

            <div className="flex justify-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleRotate} disabled={isProcessing}>
                <RotateCw className="w-4 h-4 mr-2" />
                Rotate 90°
              </Button>
            </div>
          </div>

          {/* Actions */}
          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="button"
              onClick={getCroppedImg}
              disabled={isProcessing}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Check className="w-4 h-4 mr-2" />
              {isProcessing ? "Processing..." : "Apply Crop"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
