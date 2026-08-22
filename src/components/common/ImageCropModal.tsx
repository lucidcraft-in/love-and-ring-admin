import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCw, ZoomIn, ZoomOut, X, Check } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  onCropComplete: (file: File, previewUrl: string) => void;
  aspect?: number;
  circularCrop?: boolean;
}

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
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (open) {
      setZoom([1]);
      setRotation(0);
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
    fetch(imageSrc, { mode: "cors" })
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
        console.warn("Failed to fetch image blob for cropping, fallback to direct src", err);
        if (!isCancelled) setDataUrl(imageSrc);
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

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const getCroppedImg = async () => {
    if (!imgRef.current || !crop) return;

    setIsProcessing(true);
    try {
      const image = imgRef.current;
      const canvas = document.createElement("canvas");

      const naturalWidth = image.naturalWidth || image.width;
      const naturalHeight = image.naturalHeight || image.height;

      const pixelX = (crop.x / 100) * naturalWidth;
      const pixelY = (crop.y / 100) * naturalHeight;
      const pixelWidth = (crop.width / 100) * naturalWidth;
      const pixelHeight = (crop.height / 100) * naturalHeight;

      canvas.width = Math.max(1, Math.round(pixelWidth));
      canvas.height = Math.max(1, Math.round(pixelHeight));

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      ctx.imageSmoothingQuality = "high";

      if (rotation !== 0 || zoom[0] !== 1) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom[0], zoom[0]);
        ctx.drawImage(
          image,
          pixelX,
          pixelY,
          pixelWidth,
          pixelHeight,
          -canvas.width / 2,
          -canvas.height / 2,
          canvas.width,
          canvas.height
        );
        ctx.restore();
      } else {
        ctx.drawImage(
          image,
          pixelX,
          pixelY,
          pixelWidth,
          pixelHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Canvas toBlob returned null");
            setIsProcessing(false);
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
        0.92
      );
    } catch (err) {
      console.error("Error cropping image:", err);
      setIsProcessing(false);
    }
  };

  const activeSrc = dataUrl || imageSrc;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crop & Adjust Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {activeSrc && (
            <div className="relative max-h-[400px] overflow-hidden flex justify-center bg-muted/30 rounded-lg p-2">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                aspect={aspect}
                circularCrop={circularCrop}
              >
                <img
                  ref={imgRef}
                  src={activeSrc}
                  alt="Crop preview"
                  crossOrigin="anonymous"
                  onLoad={onImageLoad}
                  style={{
                    maxHeight: "380px",
                    transform: `rotate(${rotation}deg) scale(${zoom[0]})`,
                    transition: "transform 0.2s",
                  }}
                />
              </ReactCrop>
            </div>
          )}

          {/* Controls */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4 px-2">
              <ZoomOut className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={zoom}
                onValueChange={setZoom}
                min={0.5}
                max={3}
                step={0.1}
                className="flex-1"
              />
              <ZoomIn className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="flex justify-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleRotate}>
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
              disabled={isProcessing || !crop}
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
