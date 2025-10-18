"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GalleryImageUploaderProps {
  onImageUploaded: (url: string) => void;
}

export function GalleryImageUploader({ onImageUploaded }: GalleryImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [altText, setAltText] = useState("");

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function clearSelection() {
    setSelectedFile(null);
    setPreview(null);
    setAltText("");
  }

  async function uploadImage() {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Create form data to send to API
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (altText) {
        formData.append("altText", altText);
      }

      // Upload via API route (uses admin client to bypass RLS)
      const response = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (!data.success) {
        throw new Error("Upload failed");
      }

      // Success!
      onImageUploaded(data.url);
      clearSelection();
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(`Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-zinc-900 border border-white/10 p-6 rounded-lg">
      <h3 className="text-xl font-heading text-white mb-4">Upload New Image</h3>
      
      {!preview ? (
        <div>
          <Label htmlFor="fileUpload" className="text-white/80 block mb-2">
            Select Image File
          </Label>
          <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-white/30 transition-colors cursor-pointer">
            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label htmlFor="fileUpload" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-4 text-white/50" />
              <p className="text-white/70 mb-2">Click to upload image</p>
              <p className="text-white/50 text-sm">PNG, JPG, WebP up to 5MB</p>
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            <Button
              onClick={clearSelection}
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 bg-black/80 border-white/20 hover:bg-black"
            >
              <X className="w-4 h-4 text-white" />
            </Button>
          </div>

          {/* Alt Text */}
          <div>
            <Label htmlFor="altText" className="text-white/80">
              Alt Text (Optional)
            </Label>
            <Input
              id="altText"
              type="text"
              placeholder="Describe the image"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="bg-black border-white/10 text-white"
            />
            <p className="text-xs text-white/50 mt-1">
              Helps with accessibility and SEO
            </p>
          </div>

          {/* Upload Button */}
          <Button
            onClick={uploadImage}
            disabled={uploading}
            className="w-full bg-white text-black hover:bg-white/90"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload & Add to Gallery
              </>
            )}
          </Button>
        </div>
      )}

      <div className="mt-4 p-4 bg-black/30 rounded-lg">
        <p className="text-white/60 text-sm">
          💡 <strong className="text-white">Tip:</strong> Images are uploaded to Supabase Storage
          and automatically added to your gallery with featured status.
        </p>
      </div>
    </div>
  );
}
