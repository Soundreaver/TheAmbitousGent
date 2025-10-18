"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Trash2, Star, Loader2, MoveUp, MoveDown, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryImageUploader } from "@/components/admin/gallery-image-uploader";

interface GalleryImage {
  id: string;
  url: string;
  alt_text: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleImageUploaded() {
    fetchImages();
  }

  async function toggleFeatured(id: string, currentStatus: boolean) {
    setProcessing(id);
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: !currentStatus }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update");
      }

      await fetchImages();
    } catch (error) {
      console.error("Error toggling featured status:", error);
      alert("Failed to toggle featured status");
    } finally {
      setProcessing(null);
    }
  }

  async function deleteImage(id: string) {
    if (!confirm("Are you sure you want to delete this image? This will also remove it from storage.")) return;

    setProcessing(id);
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete");
      }

      await fetchImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    } finally {
      setProcessing(null);
    }
  }

  async function updateOrder(id: string, direction: "up" | "down") {
    const currentIndex = images.findIndex((img) => img.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    setProcessing(id);
    try {
      const supabase = createClient();
      const currentImage = images[currentIndex];
      const targetImage = images[targetIndex];

      // Swap display orders
      await supabase
        .from("gallery_images")
        .update({ display_order: targetImage.display_order })
        .eq("id", currentImage.id);

      await supabase
        .from("gallery_images")
        .update({ display_order: currentImage.display_order })
        .eq("id", targetImage.id);

      await fetchImages();
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setProcessing(null);
    }
  }

  const featuredImages = images.filter((img) => img.is_featured);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Upload New Image */}
      <GalleryImageUploader onImageUploaded={handleImageUploaded} />

      {/* Featured Images Stats */}
      <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 p-6 rounded-lg">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-5 h-5 text-gold" />
          <p className="text-white">
            <span className="font-bold text-gold text-2xl">{featuredImages.length}</span>
            <span className="text-white/70 ml-2">featured images active on services page</span>
          </p>
        </div>
      </div>

      {/* Gallery Images List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-heading text-white">Gallery Images</h3>
          <p className="text-white/50 text-sm">{images.length} total</p>
        </div>
        
        {images.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/50 border border-white/5 rounded-lg">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <p className="text-white/50 text-lg mb-2">No images yet</p>
            <p className="text-white/30 text-sm">Upload your first image above to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`group relative bg-zinc-900 border rounded-lg overflow-hidden transition-all duration-300 ${
                  image.is_featured
                    ? "border-gold/30 shadow-lg shadow-gold/5"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {/* Image Preview */}
                <div className="aspect-video relative bg-black overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.alt_text || "Gallery image"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Featured Badge */}
                  {image.is_featured && (
                    <div className="absolute top-3 left-3 bg-gold text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-black" />
                      FEATURED
                    </div>
                  )}

                  {/* Processing Overlay */}
                  {processing === image.id && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                  )}
                </div>

                {/* Info & Actions */}
                <div className="p-4">
                  {/* Image Info */}
                  <div className="mb-4">
                    {image.alt_text ? (
                      <p className="text-white font-medium mb-1">{image.alt_text}</p>
                    ) : (
                      <p className="text-white/50 italic mb-1">No alt text</p>
                    )}
                    <p className="text-white/30 text-xs">Order: {image.display_order}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Order Controls */}
                    <div className="flex gap-1">
                      <Button
                        onClick={() => updateOrder(image.id, "up")}
                        disabled={index === 0 || !!processing}
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 bg-black border-white/10 hover:bg-white/5 disabled:opacity-30"
                        title="Move up"
                      >
                        <MoveUp className="w-4 h-4 text-white" />
                      </Button>
                      <Button
                        onClick={() => updateOrder(image.id, "down")}
                        disabled={index === images.length - 1 || !!processing}
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 bg-black border-white/10 hover:bg-white/5 disabled:opacity-30"
                        title="Move down"
                      >
                        <MoveDown className="w-4 h-4 text-white" />
                      </Button>
                    </div>

                    {/* Featured Toggle */}
                    <Button
                      onClick={() => toggleFeatured(image.id, image.is_featured)}
                      disabled={!!processing}
                      variant="outline"
                      size="sm"
                      className={`flex-1 h-9 transition-all ${
                        image.is_featured
                          ? "bg-gold/20 border-gold/50 hover:bg-gold/30 text-gold"
                          : "bg-black border-white/10 hover:bg-white/5 text-white/70"
                      }`}
                      title={image.is_featured ? "Remove from featured" : "Add to featured"}
                    >
                      <Star
                        className={`w-4 h-4 mr-2 ${
                          image.is_featured ? "fill-gold" : ""
                        }`}
                      />
                      {image.is_featured ? "Featured" : "Feature"}
                    </Button>

                    {/* Delete */}
                    <Button
                      onClick={() => deleteImage(image.id)}
                      disabled={!!processing}
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 p-0 bg-black border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50"
                      title="Delete image"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
