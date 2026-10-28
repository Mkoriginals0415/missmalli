import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Check, RefreshCw, Link as LinkIcon, Trash2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "banner";
  helpText?: string;
}

// Client-side image compressor & processor
export function processImageFile(file: File, maxWidth = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function ImageUpload({
  value,
  onChange,
  label,
  aspectRatio = "portrait",
  helpText,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlFallback, setShowUrlFallback] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }
    setIsProcessing(true);
    try {
      const compressedDataUrl = await processImageFile(file);
      onChange(compressedDataUrl);
    } catch (err) {
      console.error("Image processing error", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const aspectClass = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    banner: "aspect-[16/9]",
  }[aspectRatio];

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-brand-deepPlum block">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setShowUrlFallback(!showUrlFallback)}
            className="text-[10px] text-brand-plum font-semibold hover:underline flex items-center gap-1"
          >
            <LinkIcon className="w-2.5 h-2.5" />
            <span>{showUrlFallback ? "Hide URL input" : "Paste link instead"}</span>
          </button>
        </div>
      )}

      {/* Upload Zone / Drop area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition p-3 bg-white flex flex-col sm:flex-row items-center gap-4 ${
          isDragging
            ? "border-brand-plum bg-brand-lilac/10"
            : "border-brand-deepPlum/20 hover:border-brand-plum/50"
        }`}
      >
        {/* Thumbnail Preview Box */}
        <div
          className={`w-24 sm:w-28 ${aspectClass} rounded-xl overflow-hidden bg-brand-ivory border border-brand-deepPlum/10 shrink-0 relative group shadow-2xs`}
        >
          {value ? (
            <img src={value} alt="Uploaded preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-brand-deepPlum/40 p-2 text-center">
              <ImageIcon className="w-6 h-6 mb-1" />
              <span className="text-[9px] font-bold">No photo</span>
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 bg-brand-deepPlum/70 flex items-center justify-center text-white">
              <RefreshCw className="w-5 h-5 animate-spin" />
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div>
            <p className="text-xs font-bold text-brand-deepPlum">
              {value ? "Change current image" : "Upload image from computer"}
            </p>
            <p className="text-[11px] text-brand-deepPlum/60 font-medium">
              {helpText || "Drag and drop or select JPG, PNG, or WebP photo"}
            </p>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum transition shadow-xs disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5 text-brand-lilac" />
              <span>{isProcessing ? "Processing..." : "Choose Image File"}</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition"
                title="Remove image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />
        </div>
      </div>

      {/* Optional URL Input Fallback */}
      {showUrlFallback && (
        <div className="pt-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or enter image URL: https://..."
            className="w-full px-3 py-1.5 rounded-lg border border-brand-deepPlum/20 text-xs text-brand-deepPlum font-mono"
          />
        </div>
      )}
    </div>
  );
}
