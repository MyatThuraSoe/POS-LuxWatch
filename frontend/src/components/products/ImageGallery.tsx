import { Button } from "../ui";
import type { ProductImage } from "../../types/product";

interface ImageGalleryProps {
  images: ProductImage[];
  productId?: number;
  onDelete?: (imageId: number) => void;
  onSetPrimary?: (imageId: number) => void;
  editable?: boolean;
  showDeleteButton?: boolean;
}

export const ImageGallery = ({
  images,
  productId,
  onDelete,
  onSetPrimary,
  editable = false,
  showDeleteButton = false,
}: ImageGalleryProps) => {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No images uploaded yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative group aspect-square rounded-lg overflow-hidden border bg-gray-100"
        >
          <img
            src={image.url}
            alt={image.alt_text || image.url}
            className="w-full h-full object-cover"
          />
          {image.is_primary && (
            <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
              Primary
            </span>
          )}
          {(editable || showDeleteButton) && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              {!image.is_primary && onSetPrimary && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onSetPrimary(image.id)}
                  title="Set as primary"
                >
                  ★
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onDelete(image.id)}
                  title="Delete image"
                >
                  🗑
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
