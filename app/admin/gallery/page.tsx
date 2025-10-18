import { GalleryManager } from "@/components/admin/gallery-manager";

export const metadata = {
  title: "Gallery Manager | Admin",
  description: "Manage featured gallery images for the services page",
};

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading text-white mb-2">Gallery Manager</h1>
        <p className="text-white/60">
          Manage featured images that appear on the services page background. Upload images, toggle featured status, and reorder them.
        </p>
      </div>
      <GalleryManager />
    </div>
  );
}
