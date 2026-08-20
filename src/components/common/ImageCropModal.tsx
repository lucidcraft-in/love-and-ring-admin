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

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (open) {
      setZoom([1]);
      setRotation(0);
      setCrop(undefined);
    }
  }, [open]);

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

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const cropWidth = (crop.width / 100) * image.width;
      const cropHeight = (crop.height / 100) * image.height;

      canvas.width = cropWidth * scaleX;
      canvas.height = cropHeight * scaleY;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.imageSmoothingQuality = "high";

      const cropX = (crop.x / 100) * image.width * scaleX;
      const cropY = (crop.y / 100) * image.height * scaleY;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom[0], zoom[0]);

      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth * scaleX,
        cropHeight * scaleY,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
      );

      ctx.restore();

      canvas.toBlob(
        (blob) => {
          if (!blob) {
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
        0.9
      );
    } catch (err) {
      console.error("Error cropping image:", err);
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crop & Adjust Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {imageSrc && (
            <div className="relative max-h-[400px] overflow-hidden flex justify-center bg-muted/30 rounded-lg p-2">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                aspect={aspect}
                circularCrop={circularCrop}
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Crop preview"
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
